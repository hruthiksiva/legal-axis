import { db } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import type { CaseChat, ChatMessage } from '../types/chat';

const CASE_CHATS_COLLECTION = 'caseChats';

export const createCaseChat = async (caseId: string, clientId: string, lawyerId: string) => {
  const chatRef = doc(collection(db, CASE_CHATS_COLLECTION));
  const chatData: CaseChat = {
    caseId,
    participants: [clientId, lawyerId],
    messages: [],
    lastUpdated: serverTimestamp(),
  };
  await setDoc(chatRef, chatData);
  return chatRef.id;
};

export const addMessageToChat = async (chatId: string, message: Omit<ChatMessage, 'messageId'> & { messageId?: string }) => {
  const chatRef = doc(db, CASE_CHATS_COLLECTION, chatId);
  const messageId = message.messageId || doc(collection(db, CASE_CHATS_COLLECTION, chatId, 'messages')).id;
  const newMessage: ChatMessage = {
    ...message,
    messageId,
  };
  await setDoc(chatRef, {
    messages: [newMessage],
    lastUpdated: serverTimestamp(),
  }, { merge: true });
  return messageId;
};

export const getCaseChatByCaseId = async (caseId: string) => {
  const chatsRef = collection(db, CASE_CHATS_COLLECTION);
  // Firestore does not support direct array-contains-any for two values, so you may need to filter client-side
  // Here, we assume only one chat per case
  // You may want to add an index on caseId
  const chatSnap = await getDoc(doc(chatsRef, caseId));
  return chatSnap.exists() ? chatSnap.data() as CaseChat : null;
};

export const createDummyCaseChat = async () => {
  const dummyCaseId = 'dummyCase123';
  const dummyClientId = 'dummyClientId';
  const dummyLawyerId = 'dummyLawyerId';
  // Create the chat and get its ID
  const chatId = await createCaseChat(dummyCaseId, dummyClientId, dummyLawyerId);
  // Add a dummy message
  await addMessageToChat(chatId, {
    senderId: dummyClientId,
    text: 'Hello, this is a dummy message!',
    timestamp: serverTimestamp(),
  });
  return chatId;
};

// Get or create a chat document for a case and participants
export async function getOrCreateChat(caseId: string, clientId: string, clientName: string, lawyerId: string, lawyerName: string) {
  const chatId = `${caseId}_${clientId}_${lawyerId}`;
  const chatRef = doc(db, 'chats', chatId);
  const chatSnap = await getDoc(chatRef);
  if (!chatSnap.exists()) {
    await setDoc(chatRef, {
      caseId,
      clientId,
      clientName,
      lawyerId,
      lawyerName,
      participants: [clientId, lawyerId],
      createdAt: serverTimestamp(),
    });
  }
  return chatId;
}

// Send a message in a chat
export async function sendMessage(chatId: string, senderId: string, senderName: string, text: string) {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  await addDoc(messagesRef, {
    senderId,
    senderName,
    text,
    timestamp: serverTimestamp(),
  });
}

// Listen for messages in a chat (real-time)
export function listenForMessages(chatId: string, callback: (messages: any[]) => void) {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
} 