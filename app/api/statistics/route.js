// app/api/statistics/route.js
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return cachedClient;
}

const statSchema = new mongoose.Schema({
  date: Date, // Store date as a Date object
  value: Number,
});

const Stat = mongoose.models.Stat || mongoose.model('Stat', statSchema, 'lwjstock');

export async function GET() {
  await connectToDatabase();

  const stats = await Stat.find({}).sort({ date: 1 }); // Sort by date in ascending order

  return NextResponse.json({ data: stats });
}

export async function POST(req) {
  await connectToDatabase();

  const { date, value } = await req.json();

  // Convert the date string to a Date object
  const parsedDate = new Date(date);

  const stat = new Stat({ date: parsedDate, value });
  await stat.save();

  const stats = await Stat.find({}).sort({ date: 1 });
  return NextResponse.json({ data: stats });
}

export async function DELETE(req) {
  await connectToDatabase();

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  const result = await Stat.deleteOne({ _id: id });
  if (result.deletedCount === 0) return NextResponse.json({ error: 'No data found' }, { status: 404 });

  const stats = await Stat.find({}).sort({ date: 1 });
  return NextResponse.json({ message: 'Data deleted successfully', data: stats });
}