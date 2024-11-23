//
//  ❗️❗️❗️ Uncomment and ping this route to test Sentry
//

// import { handleError } from '@/error';
// import { NextResponse } from 'next/server';

// export async function GET() {
//   try {
//     const fakeResponse = await new Promise((_, reject) => {
//       setTimeout(() => {
//         reject(new Error('Middleware Error Test'));
//       }, 2000);
//     });

//     return NextResponse.json(fakeResponse);
//   } catch (error) {
//     handleError(error as Error);

//     return NextResponse.json(
//       { error: error.message || 'Internal Server Error' },
//       { status: 500 },
//     );
//   }
// }
