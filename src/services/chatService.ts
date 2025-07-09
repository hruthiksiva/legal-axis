import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { CaseChat, ChatMessage } from '../types/chat';

const CASE_CHATS_COLLECTION = 'caseChats';

export const createCaseChat = async (caseId: string, clientId: string, lawyerId: string) => {
  const chatRef = doc(collection(db, CASE_CHATS_COLLECTION));
  const chatData: CaseChat = {
    caseId,
    participants: [clientId, lawyerId],
    messages: [],
    lastUpdated: Timestamp.now(),
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
  await updateDoc(chatRef, {
    messages: arrayUnion(newMessage),
    lastUpdated: Timestamp.now(),
  });
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
    timestamp: Timestamp.now(),
  });
  return chatId;
}; 