import type { IStorage } from "./storage";
import type {
  User,
  InsertUser,
  ContactSubmission,
  InsertContact,
  ProjectUpdate,
  InsertProjectUpdate,
  ProjectMessage,
  InsertProjectMessage,
  ClientRequest,
  InsertClientRequest,
} from "@shared/schema";

function uuid(): string {
  return crypto.randomUUID();
}

function now(): Date {
  return new Date();
}

export class MemoryStorage implements IStorage {
  private users = new Map<string, User>();
  private usersByEmail = new Map<string, string>();
  private usersByUsername = new Map<string, string>();
  private contacts: ContactSubmission[] = [];
  private projectUpdates: ProjectUpdate[] = [];
  private projectMessages: ProjectMessage[] = [];
  private clientRequests: ClientRequest[] = [];

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const id = this.usersByUsername.get(username);
    return id ? this.users.get(id) : undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const id = this.usersByEmail.get(email);
    return id ? this.users.get(id) : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = uuid();
    const user: User = {
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      fullName: insertUser.fullName,
      phone: null,
      company: null,
      avatarUrl: null,
      role: "client",
      createdAt: now(),
    };
    this.users.set(id, user);
    this.usersByEmail.set(user.email, id);
    this.usersByUsername.set(user.username, id);
    return user;
  }

  async updateUser(
    id: string,
    data: Partial<Pick<User, "fullName" | "email" | "phone" | "company" | "avatarUrl" | "password" | "role">>
  ): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    if (data.email !== undefined) {
      this.usersByEmail.delete(user.email);
      this.usersByEmail.set(data.email, id);
    }
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  async createContactSubmission(contact: InsertContact): Promise<ContactSubmission> {
    const id = uuid();
    const sub: ContactSubmission = {
      id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      service: contact.service ?? null,
      questionnaireAnswers: contact.questionnaireAnswers ?? null,
      chatTranscript: contact.chatTranscript ?? null,
      createdAt: now(),
    };
    this.contacts.push(sub);
    return sub;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return [...this.contacts].reverse();
  }

  async getProjectUpdates(userId: string): Promise<ProjectUpdate[]> {
    return this.projectUpdates.filter((u) => u.userId === userId).reverse();
  }

  async getProjectUpdate(id: string): Promise<ProjectUpdate | undefined> {
    return this.projectUpdates.find((u) => u.id === id);
  }

  async createProjectUpdate(data: InsertProjectUpdate): Promise<ProjectUpdate> {
    const id = uuid();
    const update: ProjectUpdate = {
      id,
      userId: data.userId,
      title: data.title,
      status: data.status ?? "in_progress",
      progressPercent: data.progressPercent ?? 0,
      description: data.description,
      createdAt: now(),
    };
    this.projectUpdates.push(update);
    return update;
  }

  async getProjectMessages(userId: string): Promise<ProjectMessage[]> {
    return this.projectMessages.filter((m) => m.userId === userId).reverse();
  }

  async createProjectMessage(data: InsertProjectMessage): Promise<ProjectMessage> {
    const id = uuid();
    const msg: ProjectMessage = {
      id,
      userId: data.userId,
      projectUpdateId: data.projectUpdateId ?? null,
      message: data.message,
      senderType: data.senderType ?? "client",
      attachmentUrl: data.attachmentUrl ?? null,
      attachmentType: data.attachmentType ?? null,
      createdAt: now(),
    };
    this.projectMessages.push(msg);
    return msg;
  }

  async getClientRequests(userId: string): Promise<ClientRequest[]> {
    return this.clientRequests.filter((r) => r.userId === userId).reverse();
  }

  async createClientRequest(data: InsertClientRequest): Promise<ClientRequest> {
    const id = uuid();
    const req: ClientRequest = {
      id,
      userId: data.userId,
      subject: data.subject,
      message: data.message,
      status: "open",
      priority: data.priority ?? "medium",
      createdAt: now(),
    };
    this.clientRequests.push(req);
    return req;
  }

  async getClientRequest(id: string): Promise<ClientRequest | undefined> {
    return this.clientRequests.find((r) => r.id === id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getAllProjectUpdates(): Promise<ProjectUpdate[]> {
    return [...this.projectUpdates].reverse();
  }

  async getAllProjectMessages(): Promise<ProjectMessage[]> {
    return [...this.projectMessages].reverse();
  }

  async getAllClientRequests(): Promise<ClientRequest[]> {
    return [...this.clientRequests].reverse();
  }

  async updateClientRequestStatus(id: string, status: string): Promise<ClientRequest | undefined> {
    const idx = this.clientRequests.findIndex((r) => r.id === id);
    if (idx === -1) return undefined;
    const updated = { ...this.clientRequests[idx]!, status };
    this.clientRequests[idx] = updated;
    return updated;
  }

  async deleteClientRequest(id: string): Promise<boolean> {
    const idx = this.clientRequests.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    this.clientRequests.splice(idx, 1);
    return true;
  }

  async updateProjectUpdateStatus(
    id: string,
    data: { status?: string; progressPercent?: number }
  ): Promise<ProjectUpdate | undefined> {
    const idx = this.projectUpdates.findIndex((u) => u.id === id);
    if (idx === -1) return undefined;
    const updated = { ...this.projectUpdates[idx]!, ...data };
    this.projectUpdates[idx] = updated;
    return updated;
  }
}
