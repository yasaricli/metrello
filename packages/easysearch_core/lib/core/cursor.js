/**
 * A Cursor represents a pointer to the search results. Since it's specific
 * to EasySearch it can also be used to check for valid return values.
 *
 * @type {Cursor}
 */
class Cursor {
  /**
   * Constructor
   *
   * @param {Mongo.Cursor} mongoCursor   Referenced mongo cursor
   * @param {Number}       count         Count of all documents found
   * @param {Boolean}      isReady       Cursor is ready
   * @param {Object}       publishHandle Publish handle to stop if on client
   *
   * @constructor
   *
   */
  constructor(mongoCursor, count, isReady = true, publishHandle = null) {
    check(mongoCursor.fetch, Function);
    check(count, Number);
    check(isReady, Match.Optional(Boolean));
    check(publishHandle, Match.OneOf(null, Object));

    this._mongoCursor = mongoCursor;
    this._count = count;
    this._isReady = isReady;
    this._publishHandle = publishHandle;
  }

  /**
   * Fetch the search results.
   *
   * @returns {[Object]}
   */
  fetch() {
    return this._mongoCursor.fetch();
  }

 /**
  * Stop the subscription handle associated with the cursor.
  */
  stop() {
    if (this._publishHandle) {
      return this._publishHandle.stop();
    }
  }

  /**
   * Return count of all documents found
   *
   * @returns {Number}
   */
  count() {
    return this._count;
  }

  /**
   * Return if the cursor is ready.
   *
   * @returns {Boolean}
   */
  isReady() {
    return this._isReady;
  }

  /**
   * Return the raw mongo cursor.
   *
   * @returns {Mongo.Cursor}
   */
  get mongoCursor() {
    return this._mongoCursor;
  }

  /**
   * Return a fake empty cursor, without data.
   *
   * @returns {Object}
   */
  static get emptyCursor() {
    return { fetch: () => [], observe: () => { return { stop: () => null }; }, stop: () => {} };
  }
}

export default Cursor;
