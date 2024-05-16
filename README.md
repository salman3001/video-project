## Instructions

- clone this repository
- install ffmpeg in system os. for windows download from this https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-full.7z. ffmpeg is required for video conversion
- extract the zip folder in c driver and add path to environment varaible. some instruction available here https://www.geeksforgeeks.org/how-to-install-ffmpeg-on-windows/

- make sure you have node installed
- run `npm install`
- make copy of env.example file and rename it to .env --> (important)
- create a "tmp" directory at root. required by sqlite db --> (important)
- run `node ace migration:fresh`
- run `npm run dev`
- go to http://localhost:3333/
- try uploading a video. once uploaded you can varify uploaded chunks in uploads folder at project root.
- video will apear in list. you can view it . try changing the quality of the video. you can inspect network tab to see chunks streaming on demand.

## Notes

I have just written a minimal code to show the functionality. more functionality can be added.
