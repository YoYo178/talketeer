import { User } from '@src/models/user.model.js';
import { updateUser } from '@src/services/user.service.js';
import argon2 from 'argon2';
import bcrypt from 'bcrypt';

export async function handleHashMigration(userId: string, password: string) {
  const user = await User.findById(userId);
  if (!user?.hasLegacyHashing) return;

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) return;

  const newHash = await argon2.hash(password);

  await updateUser(userId, {
    passwordHash: newHash,
    hasLegacyHashing: false,
  });
}
