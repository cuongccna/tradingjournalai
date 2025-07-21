import { db } from '../config/firebase-admin';
import { 
  DocumentData, 
  DocumentSnapshot,
  Query,
  CollectionReference,
  FieldPath,
  WhereFilterOp,
  OrderByDirection,
  DocumentReference,
} from 'firebase-admin/firestore';

export interface QueryOptions {
  where?: Array<{
    field: string | FieldPath;
    operator: WhereFilterOp;
    value: any;
  }>;
  orderBy?: Array<{
    field: string | FieldPath;
    direction: OrderByDirection;
  }>;
  limit?: number;
  offset?: number;
}

export class BaseService<T extends DocumentData> {
  protected collection: CollectionReference<T>;
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.collection = db.collection(collectionName) as CollectionReference<T>;
  }

  async create(data: T): Promise<T & { id: string }> {
    const docRef = await this.collection.add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T);
    
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as T & { id: string };
  }

  async createWithId(id: string, data: T): Promise<T & { id: string }> {
    const docRef = this.collection.doc(id);
    await docRef.set({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T);
    
    return { id, ...data } as T & { id: string };
  }

  async findById(id: string): Promise<(T & { id: string }) | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as T & { id: string };
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    await this.collection.doc(id).update({
      ...data,
      updatedAt: new Date(),
    });
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }

  async findAll(queryFn?: (ref: CollectionReference<T>) => Query<T>): Promise<(T & { id: string })[]> {
    let query: Query<T> = this.collection;
    
    if (queryFn) {
      query = queryFn(this.collection);
    }
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T & { id: string }));
  }

  async findWithOptions(options: QueryOptions): Promise<(T & { id: string })[]> {
    let query: Query<T> = this.collection;

    // Apply where clauses
    if (options.where) {
      for (const where of options.where) {
        query = query.where(where.field, where.operator, where.value);
      }
    }

    // Apply orderBy
    if (options.orderBy) {
      for (const orderBy of options.orderBy) {
        query = query.orderBy(orderBy.field, orderBy.direction);
      }
    }

    // Apply pagination
    if (options.offset) {
      query = query.offset(options.offset);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T & { id: string }));
  }

  async count(queryFn?: (ref: CollectionReference<T>) => Query<T>): Promise<number> {
    let query: Query<T> = this.collection;
    
    if (queryFn) {
      query = queryFn(this.collection);
    }
    
    const snapshot = await query.count().get();
    return snapshot.data().count;
  }

  async exists(id: string): Promise<boolean> {
    const doc = await this.collection.doc(id).get();
    return doc.exists;
  }

  async batchCreate(items: T[]): Promise<(T & { id: string })[]> {
    const batch = db.batch();
    const results: (T & { id: string })[] = [];

    for (const item of items) {
      const docRef = this.collection.doc();
      const data = {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as T;
      
      batch.set(docRef, data);
      results.push({ id: docRef.id, ...data });
    }

    await batch.commit();
    return results;
  }

  async batchUpdate(updates: Array<{ id: string; data: Partial<T> }>): Promise<void> {
    const batch = db.batch();

    for (const update of updates) {
      const docRef = this.collection.doc(update.id);
      batch.update(docRef, {
        ...update.data,
        updatedAt: new Date(),
      });
    }

    await batch.commit();
  }

  async batchDelete(ids: string[]): Promise<void> {
    const batch = db.batch();

    for (const id of ids) {
      const docRef = this.collection.doc(id);
      batch.delete(docRef);
    }

    await batch.commit();
  }

  // Transaction support
  async runTransaction<R>(
    updateFunction: (transaction: FirebaseFirestore.Transaction) => Promise<R>
  ): Promise<R> {
    return db.runTransaction(updateFunction);
  }

  // Real-time listeners
  onSnapshot(
    id: string,
    onNext: (snapshot: DocumentSnapshot<T>) => void,
    onError?: (error: Error) => void
  ): () => void {
    return this.collection.doc(id).onSnapshot(onNext, onError);
  }

  onCollectionSnapshot(
    queryFn: ((ref: CollectionReference<T>) => Query<T>) | undefined,
    onNext: (snapshot: FirebaseFirestore.QuerySnapshot<T>) => void,
    onError?: (error: Error) => void
  ): () => void {
    let query: Query<T> = this.collection;
    
    if (queryFn) {
      query = queryFn(this.collection);
    }

    return query.onSnapshot(onNext, onError);
  }
}