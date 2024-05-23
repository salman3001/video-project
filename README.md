## Instructions

- clone this repository
- install ffmpeg in system os. for windows download from this https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-full.7z. ffmpeg is required for video conversion
- extract the zip folder in c driver and add path to environment varaible. some instruction available here https://www.geeksforgeeks.org/how-to-install-ffmpeg-on-windows/

- make sure you have node installed
- run `npm install`
- run `npm run dev`
- go to http://localhost:3333/
- add 2 to 3 videos and uload. varify netwrok tab that data is uploaded in chunks.
- <mark>(this will work oonly in main branch)</mark> --> video will apear in list. you can view it . try changing the quality of the video. you can inspect network tab to see chunks streaming on demand.

## Notes

I have just written a minimal code to show the functionality. more functionality can be added.
