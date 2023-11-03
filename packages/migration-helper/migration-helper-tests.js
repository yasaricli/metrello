// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by migration-helper.js.
import { name as packageName } from "meteor/jkuester:migration-helper";

// Write your tests here!
// Here is an example.
Tinytest.add('migration-helper - example', function (test) {
  test.equal(packageName, "migration-helper");
});
