import mongoose from 'mongoose';
import Item from '../models/Item.js';

const allowedTypes = ['lost', 'found'];
const allowedCategories = ['Electronics', 'Accessories', 'ID cards', 'Books', 'Keys', 'Other'];

export async function listItems(req, res, next) {
  try {
    const { search = '', type = 'all' } = req.query;
    const filter = {};
    if (type !== 'all') {
      if (!allowedTypes.includes(type)) return res.status(400).json({ message: 'Type must be lost, found, or all.' });
      filter.type = type;
    }
    if (typeof search !== 'string' || search.length > 100) return res.status(400).json({ message: 'Search must be 100 characters or fewer.' });
    if (search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
        { location: { $regex: escaped, $options: 'i' } },
      ];
    }
    const items = await Item.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ items });
  } catch (error) { next(error); }
}

export async function createItem(req, res, next) {
  try {
    const { title, type, category, location, date, description = '', contact = '' } = req.body;
    if (typeof title !== 'string' || title.trim().length < 2 || title.trim().length > 100) return res.status(400).json({ message: 'Item name must be between 2 and 100 characters.' });
    if (!allowedTypes.includes(type)) return res.status(400).json({ message: 'Choose lost or found.' });
    if (!allowedCategories.includes(category)) return res.status(400).json({ message: 'Choose a valid category.' });
    if (typeof location !== 'string' || !location.trim() || location.length > 150) return res.status(400).json({ message: 'Enter a location (up to 150 characters).' });
    const reportDate = new Date(date);
    if (!date || Number.isNaN(reportDate.getTime()) || reportDate > new Date()) return res.status(400).json({ message: 'Enter a valid date that is not in the future.' });
    if (typeof description !== 'string' || description.length > 1000 || typeof contact !== 'string' || contact.length > 150) return res.status(400).json({ message: 'Description or contact information is too long.' });
    const item = await Item.create({ title: title.trim(), type, category, location: location.trim(), date: reportDate, description: description.trim(), contact: contact.trim() });
    res.status(201).json({ item });
  } catch (error) { next(error); }
}

export async function getItem(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid item ID.' });
    const item = await Item.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: 'Item report not found.' });
    res.json({ item });
  } catch (error) { next(error); }
}

export async function updateItemStatus(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid item ID.' });
    if (req.body.status !== 'open' && req.body.status !== 'returned') return res.status(400).json({ message: 'Status must be open or returned.' });
    const item = await Item.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Item report not found.' });
    res.json({ item });
  } catch (error) { next(error); }
}
