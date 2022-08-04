import { deleteDoc, setDoc } from "firebase/firestore/lite";
import { Article } from "^types/article";
import { Author } from "^types/author";
import { Image } from "^types/image";
import { RecordedEvent } from "^types/recordedEvent";
import { Collection } from "../collectionKeys";
import { getDocRef } from "../getRefs";

export const writeArticle = async (article: Article) => {
  const docRef = getDocRef(Collection.ARTICLES, article.id);
  await setDoc(docRef, article);
};

export const deleteArticle = async (id: string) => {
  const docRef = getDocRef(Collection.ARTICLES, id);
  await deleteDoc(docRef);
};

export const writeRecordedEvent = async (recordedEvent: RecordedEvent) => {
  const docRef = getDocRef(Collection.RECORDEDEVENTS, recordedEvent.id);
  await setDoc(docRef, recordedEvent);
};

export const deleteRecordedEvent = async (id: string) => {
  const docRef = getDocRef(Collection.RECORDEDEVENTS, id);
  await deleteDoc(docRef);
};

export const writeImage = async (image: Image) => {
  const docRef = getDocRef(Collection.IMAGES, image.id);
  await setDoc(docRef, image);
};

export const deleteImage = async (id: string) => {
  const docRef = getDocRef(Collection.IMAGES, id);
  await deleteDoc(docRef);
};

export const writeAuthor = async (author: Author) => {
  const docRef = getDocRef(Collection.AUTHORS, author.id);
  await setDoc(docRef, author);
};

export const deleteAuthor = async (id: string) => {
  const docRef = getDocRef(Collection.AUTHORS, id);
  await deleteDoc(docRef);
};
