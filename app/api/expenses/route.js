import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongodb';
import Expense from '@/app/models/Expense';

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const expense = await Expense.create(data);
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const expenses = await Expense.find().sort({ date: -1 });
    return NextResponse.json({ expenses }); // Now returning an object with expenses array
  } catch (error) {
    return NextResponse.json({ error: error.message, expenses: [] }, { status: 400 });
  }
}
