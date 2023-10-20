import {
  Index,
  Engine,
  ReactiveEngine,
  Cursor,
  MongoDBEngine,
  MinimongoEngine,
  MongoTextIndexEngine
} from './main';

EasySearch = {
  // Core
  Index,
  Engine,
  ReactiveEngine,
  Cursor,
  // Engines
  MongoDB: MongoDBEngine,
  Minimongo: MinimongoEngine,
  MongoTextIndex: MongoTextIndexEngine
};
