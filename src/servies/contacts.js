import { CLOUDINARY, SORT_ORDER } from '../constants/constants.js';
import { Contact } from '../db/models/contact.js';
import { createPaginationData } from '../utils/createPaginationData.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactQuery = Contact.find({ userId });

  if (filter.contactType) {
    contactQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  contactQuery.where('userId').equals(userId);

  const [contactCount, contacts] = await Promise.all([
    Contact.find().merge(contactQuery).countDocuments(),
    contactQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = createPaginationData(contactCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = (contactId, userId) => {
  const contact = Contact.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async ({ photo, ...payload }, userId) => {
  let photoUrl;

  if (env(CLOUDINARY.ENABLE_CLOUDINARY) === 'true') {
    photoUrl = await saveFileToCloudinary(photo);
  } else {
    photoUrl = await saveFileToUploadDir(photo);
  }

  const contact = Contact.create({
    ...payload,
    userId: userId,
    photo: photoUrl.url,
  });

  return contact;
};

export const upsertsContact = async (
  contactId,
  userId,
  payload,
  options = {},
) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    {
      new: true,
      includesResultMetadata: true,
      ...options,
    },
  );

  return result;
};

export const deleteContactById = async (contactId, userId) => {
  const result = await Contact.findOneAndDelete({ _id: contactId, userId });
  return result;
};