const express = require('express')

const app = express()

const { exec } = require('node:child_process')

app.get('/mpd',(req,res)=>{
    let filename = req.query.filename
    res.send('File is processing')
    // let cmd = 'ffmpeg -re -i ./a.mp4 -map 0 -map 0 -c:a aac -c:v libx264 -b:v:0 800k -b:v:1 300k -s:v:1 320x170 -profile:v:1 baseline -profile:v:0 main -bf 1 -keyint_min 120 -g 120 -sc_threshold 0 -b_strategy 0 -ar:a:1 22050 -use_timeline 1 -use_template 1 -window_size 5 -adaptation_sets "id=0,streams=v id=1,streams=a" -f dash ./b.mpd'
    let cmd = `ffmpeg -re -i ./${filename}.mp4 -map 0 -map 0 -map 0 -c:a aac -c:v libx264 -b:v:1 800k -b:v:2 500k -s:v:1 1920x1080 -s:v:1 1280x720 -s:v:2 720x480 -profile:v:1 baseline -profile:v:2 baseline -profile:v:0 main -bf 1 -keyint_min 120 -g 120 -sc_threshold 0 -b_strategy 0 -ar:a:1 22050 -use_timeline 1 -use_template 1 -adaptation_sets "id=0,streams=v id=1,streams=a" -f dash ./segments/${filename}_out.mpd`

    exec(cmd, (err, output) => {
        // once the command has completed, the callback function is called
        if (err) {
            // log and return if we encounter an error
            console.error("could not execute command: ", err)
            return
        }
        // log the output received from the command
        console.log("Mpd file has been generated");
        
    })
})


app.listen(4000, ()=>{
    console.log(`Listening on http://localhost:4000`)
  });
  