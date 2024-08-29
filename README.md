# AI Image/Video Editor Application

https://github.com/user-attachments/assets/78f7166a-11b1-4bd5-a1f8-aa5c4cd53777


## 📋 <a name="table">Table of Contents</a>

1. ⚙️ [Tech Stack](#tech-stack)
2. 🔋 [Features](#features)
3. 🤸 [Quick Start](#quick-start)

## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js 14
- TypeScript
- Cloudinary
- shadcn
- Tailwind CSS
- others
  - framer-motion
  - lottie-react
  - lucide-react
  - react-dropzone
  - zod
  - zustand

## <a name="features">🔋 Features</a>


👉 **Media Upload & Management**: Enables seamless media upload and management with Cloudinary, allowing users to store, organize, and retrieve images, videos, and other media assets efficiently.

👉 **Image & Video Optimization**: Automatically optimizes images and videos for performance, reducing load times and ensuring high-quality media delivery across various devices and platforms.

👉 **Dynamic Media Transformation**: Offers powerful transformation capabilities, enabling real-time resizing, cropping, format conversion, and applying effects to images and videos directly via URL-based API.

and many more, including code architecture and reusability.


## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
CLOUDINARY_UPLOAD_PRESET=

```

Replace the placeholder values with your Cloudinary credentials, which you can obtain by signing up on the [Cloudinary website](https://cloudinary.com/). To fully enable the functionality, be sure to activate the following Add-ons:
- `AI Background Removal`
- `AI Video Transcription`

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## Reference
- https://www.youtube.com/watch?v=vH2lUJw9r0k