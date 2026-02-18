import {
  type User, type InsertUser,
  type ContactSubmission, type InsertContact,
  type ProjectUpdate, type InsertProjectUpdate,
  type ProjectMessage, type InsertProjectMessage,
  type ClientRequest, type InsertClientRequest,
} from "@shared/schema";
import { users, contactSubmissions, projectUpdates, projectMessages, clientRequests } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<Pick<User, "fullName" | "email" | "phone" | "company" | "avatarUrl" | "password">>): Promise<User | undefined>;
  createContactSubmission(contact: InsertContact): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  getProjectUpdates(userId: string): Promise<ProjectUpdate[]>;
  createProjectUpdate(data: InsertProjectUpdate): Promise<ProjectUpdate>;
  getProjectMessages(userId: string): Promise<ProjectMessage[]>;
  createProjectMessage(data: InsertProjectMessage): Promise<ProjectMessage>;
  getClientRequests(userId: string): Promise<ClientRequest[]>;
  createClientRequest(data: InsertClientRequest): Promise<ClientRequest>;
  getClientRequest(id: string): Promise<ClientRequest | undefined>;
  getAllUsers(): Promise<User[]>;
  getAllProjectUpdates(): Promise<ProjectUpdate[]>;
  getAllProjectMessages(): Promise<ProjectMessage[]>;
  getAllClientRequests(): Promise<ClientRequest[]>;
  updateClientRequestStatus(id: string, status: string): Promise<ClientRequest | undefined>;
  updateProjectUpdateStatus(id: string, data: { status?: string; progressPercent?: number }): Promise<ProjectUpdate | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<Pick<User, "fullName" | "email" | "phone" | "company" | "avatarUrl" | "password">>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user;
  }

  async createContactSubmission(contact: InsertContact): Promise<ContactSubmission> {
    const [submission] = await db.insert(contactSubmissions).values(contact).returning();
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return db.select().from(contactSubmissions);
  }

  async getProjectUpdates(userId: string): Promise<ProjectUpdate[]> {
    return db.select().from(projectUpdates).where(eq(projectUpdates.userId, userId)).orderBy(desc(projectUpdates.createdAt));
  }

  async createProjectUpdate(data: InsertProjectUpdate): Promise<ProjectUpdate> {
    const [update] = await db.insert(projectUpdates).values(data).returning();
    return update;
  }

  async getProjectMessages(userId: string): Promise<ProjectMessage[]> {
    return db.select().from(projectMessages).where(eq(projectMessages.userId, userId)).orderBy(desc(projectMessages.createdAt));
  }

  async createProjectMessage(data: InsertProjectMessage): Promise<ProjectMessage> {
    const [msg] = await db.insert(projectMessages).values(data).returning();
    return msg;
  }

  async getClientRequests(userId: string): Promise<ClientRequest[]> {
    return db.select().from(clientRequests).where(eq(clientRequests.userId, userId)).orderBy(desc(clientRequests.createdAt));
  }

  async createClientRequest(data: InsertClientRequest): Promise<ClientRequest> {
    const [req] = await db.insert(clientRequests).values(data).returning();
    return req;
  }

  async getClientRequest(id: string): Promise<ClientRequest | undefined> {
    const [req] = await db.select().from(clientRequests).where(eq(clientRequests.id, id));
    return req;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAllProjectUpdates(): Promise<ProjectUpdate[]> {
    return db.select().from(projectUpdates).orderBy(desc(projectUpdates.createdAt));
  }

  async getAllProjectMessages(): Promise<ProjectMessage[]> {
    return db.select().from(projectMessages).orderBy(desc(projectMessages.createdAt));
  }

  async getAllClientRequests(): Promise<ClientRequest[]> {
    return db.select().from(clientRequests).orderBy(desc(clientRequests.createdAt));
  }

  async updateClientRequestStatus(id: string, status: string): Promise<ClientRequest | undefined> {
    const [req] = await db.update(clientRequests).set({ status }).where(eq(clientRequests.id, id)).returning();
    return req;
  }

  async updateProjectUpdateStatus(id: string, data: { status?: string; progressPercent?: number }): Promise<ProjectUpdate | undefined> {
    const [update] = await db.update(projectUpdates).set(data).where(eq(projectUpdates.id, id)).returning();
    return update;
  }
}

export const storage = new DatabaseStorage();
