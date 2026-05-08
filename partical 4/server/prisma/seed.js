const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const sampleVideos = [
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://www.w3schools.com/html/movie.mp4',
  'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
  'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
  'https://samplelib.com/lib/preview/mp4/sample-15s.mp4',
];

async function main() {
  console.log('Starting seeding process...');

  console.log('Cleaning up existing data...');
  await prisma.commentLike.deleteMany({});
  await prisma.videoLike.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.video.deleteMany({});
  await prisma.follow.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Database cleaned.');

  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.create({
      data: {
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: hashedPassword,
        name: `User ${i}`,
        bio: `This is the bio for user ${i}`,
        avatar: `https://i.pravatar.cc/150?u=user${i}@example.com`
      }
    });
    users.push(user);
    console.log(`Created user: ${user.username} (id: ${user.id})`);
  }

  console.log('Creating videos...');
  const videos = [];
  for (let i = 0; i < users.length; i++) {
    for (let j = 1; j <= 5; j++) {
      const videoUrl = sampleVideos[(j - 1) % sampleVideos.length];
      const video = await prisma.video.create({
        data: {
          userId: users[i].id, // ✅ use actual user ID
          caption: `Video ${j} from user ${i + 1}`,
          videoUrl: videoUrl,
          thumbnailUrl: `https://i.pravatar.cc/300?u=video${i + 1}_${j}`,
          audioName: `Original Sound - User ${i + 1}`,
          views: Math.floor(Math.random() * 10000)
        }
      });
      videos.push(video);
      console.log(`Created video: ${video.id}`);
    }
  }

  console.log('Creating comments...');
  for (let i = 0; i < 200; i++) {
    const randomVideoIndex = Math.floor(Math.random() * videos.length);
    const randomUserIndex = Math.floor(Math.random() * users.length);
    await prisma.comment.create({
      data: {
        userId: users[randomUserIndex].id,
        videoId: videos[randomVideoIndex].id,
        content: `This is comment ${i + 1}. Lorem ipsum dolor sit amet.`
      }
    });
    console.log(`Created comment: ${i + 1}`);
  }

  console.log('Creating video likes...');
  const videoLikes = [];
  for (let i = 0; i < 300; i++) {
    const randomVideoIndex = Math.floor(Math.random() * videos.length);
    const randomUserIndex = Math.floor(Math.random() * users.length);
    const videoId = videos[randomVideoIndex].id;
    const userId = users[randomUserIndex].id;
    const existingLike = videoLikes.find(
      like => like.userId === userId && like.videoId === videoId
    );
    if (!existingLike) {
      try {
        await prisma.videoLike.create({ data: { userId, videoId } });
        videoLikes.push({ userId, videoId });
        console.log(`Created video like: User ${userId} liked Video ${videoId}`);
      } catch (error) {
        console.log(`Skipping duplicate like`);
      }
    }
  }

  console.log('Creating comment likes...');
  const comments = await prisma.comment.findMany();
  for (let i = 0; i < 150; i++) {
    const randomCommentIndex = Math.floor(Math.random() * comments.length);
    const randomUserIndex = Math.floor(Math.random() * users.length);
    const commentId = comments[randomCommentIndex].id;
    const userId = users[randomUserIndex].id;
    try {
      await prisma.commentLike.create({ data: { userId, commentId } });
      console.log(`Created comment like`);
    } catch (error) {
      console.log(`Skipping duplicate comment like`);
    }
  }

  console.log('Creating follows...');
  for (let i = 0; i < 40; i++) {
    let followerIndex = Math.floor(Math.random() * users.length);
    let followingIndex = Math.floor(Math.random() * users.length);
    while (followerIndex === followingIndex) {
      followingIndex = Math.floor(Math.random() * users.length);
    }
    try {
      await prisma.follow.create({
        data: {
          followerId: users[followerIndex].id,
          followingId: users[followingIndex].id
        }
      });
      console.log(`Created follow`);
    } catch (error) {
      console.log(`Skipping duplicate follow`);
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });