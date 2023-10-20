import ElasticSearchDataSyncer from './data-syncer'

if (Meteor.isServer) {
  var Future = Npm.require('fibers/future'),
    elasticsearch = Npm.require('elasticsearch');
}

/**
 * The ElasticsearchEngine lets you search documents through an Elasticsearch Index.
 *
 * @type {ElasticSearchEngine}
 */
 class ElasticSearchEngine extends EasySearch.ReactiveEngine {
  /**
   * Constructor.
   */
  constructor() {
    super(...arguments);
  }

  /**
   * Return default configuration.
   *
   * @returns {Object}
   */
  defaultConfiguration() {
    return _.defaults({}, ElasticSearchEngine.defaultElasticsearchConfiguration(), super.defaultConfiguration());
  }

  /**
   * Default configuration.
   *
   * @returns {Object}
   */
  static defaultElasticsearchConfiguration() {
    return {
      indexName: 'easysearch',
      /**
       * Return the fields to index in ElasticSearch.
       *
       * @param {Object} options Index options
       *
       * @returns {null|Array}
       */
      fieldsToIndex(options) {
        return null;
      },
      /**
       * The ES query object used for searching the results.
       *
       * @param {Object} searchObject Search object
       * @param {Object} options      Search options
       *
       * @return array
       */
      query(searchObject, options) {
        let query = {
          bool: {
            should: []
          }
        };

        _.each(searchObject, function (searchString, field) {
          query.bool.should.push({
            match: {
              [field]: {
                query: searchString,
                fuzziness: 'AUTO',
                operator:  'or'
              }
            }
          });
        });

        return query;
      },
      /**
       * The ES sorting method used for sorting the results.
       *
       * @param {Object} searchObject Search object
       * @param {Object} options      Search options
       *
       * @return array
       */
      sort(searchObject, options) {
        return options.index.fields;
      },
      /**
       * Return the ElasticSearch document to index.
       *
       * @param {Object} doc    Document to index
       * @param {Array}  fields Array of document fields
       */
      getElasticSearchDoc(doc, fields) {
        if (null === fields) {
          return doc;
        }

        let partialDoc = {};

        _.each(fields, function (field) {
          if (_.has(doc, field)) {
            partialDoc[field] = _.get(doc, field);
          }
        });

        return partialDoc;
      },
      /**
       * Return the elastic search body.
       *
       * @param {Object} body Existing ES body
       *
       * @return {Object}
       */
      body: (body) => body,
      /**
       * Default ES client configuration.
       */
      client: {
        host: 'localhost:9200',
      },
    };
  }

  /**
   * Put mapping according to mapping field provided when creating an EasySearch index
   *
   * @param {Object}   indexConfig Index configuration
   * @param {Function} cb          callback on finished mapping
   */
  putMapping(indexConfig = {}, cb) {
    const {
      mapping: body,
      elasticSearchClient,
    } = indexConfig;

    if (!body) {
      return cb();
    }

    const { indexName } = this.config
    const type = this.getIndexType(indexConfig)

    elasticSearchClient.indices.create({
      updateAllTypes: false,
      index: indexName,
    }, Meteor.bindEnvironment(() => {
      elasticSearchClient.indices.getMapping({
        index: indexName,
        type
      }, Meteor.bindEnvironment((err, res) => {
        const isEmpty = Object.keys(res).length === 0 && res.constructor === Object;
        if (!isEmpty) {
          return cb();
        }

        elasticSearchClient.indices.putMapping({
          updateAllTypes: false,
          index: indexName,
          type,
          body
        }, cb);
      }));
    }));
  }

  /**
   * @returns {String}
   */
  getIndexType(indexConfig) {
    return this.config.indexType || indexConfig.name;
  }

  /**
   * Act on index creation.
   *
   * @param {Object} indexConfig Index configuration
   */
  onIndexCreate(indexConfig) {
    super.onIndexCreate(indexConfig);

    if (Meteor.isServer) {
      indexConfig.elasticSearchClient = new elasticsearch.Client(this.config.client);
      this.putMapping(indexConfig, Meteor.bindEnvironment(() => {
        indexConfig.elasticSearchSyncer = new ElasticSearchDataSyncer({
          indexName: this.config.indexName,
          indexType: this.getIndexType(indexConfig),
          collection: indexConfig.collection,
          client: indexConfig.elasticSearchClient,
          beforeIndex: (doc) => this.callConfigMethod('getElasticSearchDoc', doc, this.callConfigMethod('fieldsToIndex', indexConfig))
        });
      }));
    }
  }

  /**
   * Return the reactive search cursor.
   *
   * @param {Object} searchDefinition Search definition
   * @param {Object} options          Search and index options
   */
  getSearchCursor(searchDefinition, options) {
    let fut = new Future(),
      body = {};

    searchDefinition = EasySearch.MongoDB.prototype.transformSearchDefinition(searchDefinition, options);

    body.query = this.callConfigMethod('query', searchDefinition, options);
    body.sort = this.callConfigMethod('sort', searchDefinition, options);
    body.fields = ['_id'];

    body = this.callConfigMethod('body', body, options);

    options.index.elasticSearchClient.search({
      index: this.config.indexName,
      type: this.getIndexType(options.index),
      body: body,
      size: options.search.limit,
      from: options.search.skip
    }, Meteor.bindEnvironment((error, data) => {
      if (error) {
        console.log('Had an error while searching!');
        console.log(error);
        return;
      }

      let { total, ids } = this.getCursorData(data),
        cursor;

      if (ids.length > 0) {
        cursor = options.index.collection.find({
          $or: _.map(ids, (_id) => {
            return { _id };
          })
        }, { limit: options.search.limit, sort: options.search.sort || {} });
      } else {
        cursor = EasySearch.Cursor.emptyCursor;
      }

      fut['return'](new EasySearch.Cursor(cursor, total));
    }));

    return fut.wait();
  }

  /**
   * Get data for the cursor from the elastic search response.
   *
   * @param {Object} data ElasticSearch data
   *
   * @returns {Object}
   */
  getCursorData(data) {
    return {
      ids : _.map(data.hits.hits, (resultSet) => resultSet._id),
      total: data.hits.total
    };
  }
}

EasySearch.ElasticSearch = ElasticSearchEngine

export default ElasticSearchEngine
