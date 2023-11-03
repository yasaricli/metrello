// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See migration-helper-tests.js for an example of importing.
//export const name = 'migration-helper';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {ValidatedMethod } from 'meteor/mdg:validated-method';

// some common pattern
const newLine = /\n/g;
const whiteSpace = /\s+/g;

// return the current location
// of function execution, considering
// multiple levels of wrappers
const getLocation = () => {
  const e = new Error('');
  const lines = e.stack.split(newLine);
  return lines[3].replace(whiteSpace, ' ').trim();
}

// monkey-patch a Collection/Cursor proto function
// to inject some analysis code without altering
// the original behavior
const patch = (proto, name) => {
  const original = proto[name];
  const className = proto.constructor.name;

  proto[name] = function (...args) {
    const self = this;
    const location = getLocation();
    const isWrappedAsync = location.includes(`as ${name}Async`);

    if (!isWrappedAsync) {
      console.warn(`Deprecated: ${className}.${name} needs to be migrated to ${name}Async in collection "${self._name}"!`);
      console.warn('=>', location);
    }
    return original.call(self, ...args);
  }
}

// apply patching to Mongo.Collection functions
const mNames = ['insert', 'update', 'remove', 'findOne', 'createIndex'];
const mProto = Mongo.Collection.prototype;
mNames.forEach(name => patch(mProto, name));

// applying patches Mongo.Cursor functions
const cNames = ['count', 'forEach', 'map', 'fetch'];
const cProto = Mongo.Cursor.prototype;
cNames.forEach(name => patch(cProto, name));

// ...continueing in migration-helper.js

const asyncLine = /\s*return Promise.asyncApply\(\(\) => {\n/g;

// scans a function body for the above pattern
// to detect async functions
const analyze = ({ name, fn, location, type }) => {
  const source = fn.toString();
  const lines = source.split(byNewline);
  const isAsync = asyncLine.test(lines[1]);

  if (!isAsync) {
    console.warn(`Deprecated (${type}): ${name} is not async, consider migrating now.`);
  }
}
