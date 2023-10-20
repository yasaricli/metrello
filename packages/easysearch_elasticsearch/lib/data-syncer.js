/**
 * The ElasticSearchDataSyncer syncs data between a collection and a specified index.
 *
 * @type {ElasticSearchDataSyncer}
 */
class ElasticSearchDataSyncer {
  /**
   * Constructor.
   *
   * @param indexName    {String}   Index name
   * @param indexType    {String}   Index type
   * @param collection   {Object}   Mongo Collection
   * @param client       {Object}   ElasticSearch client
   * @param beforeIndex  {Function} Change document before indexing
   */
  constructor({indexName, indexType, collection, client, beforeIndex}) {
    this.indexName = indexName;
    this.indexType = indexType;
    this.collection = collection;
    this.client = client;

    const removeId = (obj) => {
      let { _id, ...rest } = obj
      return rest;
    }

    this.collection.find().observeChanges({
      added: (id, fields) => {
        this.writeToIndex(removeId(beforeIndex(fields)), id);
      },
      changed: (id) => {
        this.writeToIndex(removeId(beforeIndex(collection.findOne(id))), id);
      },
      removed: (id) => {
        this.client.delete({
          index: this.indexName,
          type: this.indexType,
          id: id
        });
      }
    });
  }

  /**
   * Write a document to a specified index.
   *
   * @param {Object} doc Document to write into the index
   * @param {String} id  ID of the document
   */
  writeToIndex(doc, id) {
    this.client.index({
      index : this.indexName,
      type : this.indexType,
      id : id,
      body : doc
    });
  }
}

export default ElasticSearchDataSyncer
