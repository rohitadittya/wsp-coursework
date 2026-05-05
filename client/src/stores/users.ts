import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { DataEnvelope, DataListEnvelope, User } from '../../../server/types';
import useSessionStore from './session';
import { type PagingRequest } from '../../../server/types/dataEnvelopes';

export const useUsersStore = defineStore('users', () => {
  const session = useSessionStore();
  const users = ref<User[]>([]);
  const totalCount = ref<number | null>(null);

  async function loadUsers(pagingParams?: PagingRequest) {
    const url = pagingParams
      ? `users?${new URLSearchParams(pagingParams as Record<string, string>)}`
      : 'users';

    const data = await session.api<DataListEnvelope<User>>(url);

    users.value = data.data;
    totalCount.value = data.total;
  }

  async function getUser(id: number) {
    return session.api<DataEnvelope<User>>(`users/${id}`);
  }

  async function createUser(user: Omit<User, 'id'>) {
    const data = await session.api<DataEnvelope<User>>('users', user);
    users.value.push(data.data);
    return data;
  }

  async function updateUser(id: number, user: Omit<User, 'id'>) {
    const data = await session.api<DataEnvelope<User>>(`users/${id}`, user, {
      method: 'PATCH',
    });

    const index = users.value.findIndex((u) => u.id === id);
    if (index !== -1) {
      users.value[index] = data.data;
    }

    return data;
  }

  async function deleteUser(id: number) {
    const data = await session.api<DataEnvelope<User>>(`users/${id}`, null, {
      method: 'DELETE',
    });

    const index = users.value.findIndex((u) => u.id === id);
    if (index !== -1) {
      users.value.splice(index, 1);
    }

    return data;
  }

  return { users, loadUsers, getUser, createUser, updateUser, deleteUser, totalCount }
})
