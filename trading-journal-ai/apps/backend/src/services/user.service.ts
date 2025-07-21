import { BaseService } from '@trading-journal/database';
import { User } from '@trading-journal/shared';

export class UserService extends BaseService<User> {
  constructor() {
    super('users');
  }

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.collection
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
  }
}