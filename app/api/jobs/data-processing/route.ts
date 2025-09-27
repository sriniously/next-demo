import { NextRequest, NextResponse } from 'next/server';
import { dataProcessingQueue } from '@/lib/queue';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, filePath, data, processingOptions } = body;

    if (!type) {
      return NextResponse.json(
        { error: 'Missing required field: type' },
        { status: 400 }
      );
    }

    const job = await dataProcessingQueue.add({
      type,
      filePath,
      data,
      processingOptions,
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      message: 'Data processing job queued successfully',
    });
  } catch (error) {
    console.error('Error adding data processing job:', error);
    return NextResponse.json(
      { error: 'Failed to queue data processing job' },
      { status: 500 }
    );
  }
}