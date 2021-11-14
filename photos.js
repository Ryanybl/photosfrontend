function searchPhoto(){
    var apiKey = '0wag7ZTxq88QlvoBQpayO1qqAcuGR5fD1VMCEhKP'
    var client = apigClientFactory.newClient({
        apiKey: apiKey
    });

    var q = document.getElementById("searchInput").value;
    var params = {
        q: q
    }
    var additionalParams = {
        headers: {
            'Content-Type': "application/json"
        }
    }
    client.searchGet(params, {}, additionalParams)
        .then(function (response){
            console.log(response)
            data = response.data.replaceAll("\'", "\"")
            console.log(data)
            data = JSON.parse(data)
            console.log(data)
            for (let i = 0; i < data.length; i++) {
                url = data[i];
                img = document.createElement('img');
                img.src = url;
                img.style.width = '400px';
                img.style.height = 'auto';
                document.getElementById("search-results").appendChild(img);
            }
        })
}

function transcribe(){
    var apiKey = '0wag7ZTxq88QlvoBQpayO1qqAcuGR5fD1VMCEhKP'
    var client = apigClientFactory.newClient({
        apiKey: apiKey
    });

    var params = {
        q: "audio"
    }
    var additionalParams = {
        headers: {
            'Content-Type': "application/json"
        }
    }
    console.log("transcribing audio, this may take a while...")
    client.searchGet(params, {}, additionalParams)
        .then(function (response){
            console.log(response)
            data = response.data.replaceAll("\'", "\"")
            console.log(data)
            data = JSON.parse(data)
            console.log(data)
            for (let i = 0; i < data.length; i++) {
                url = data[i];
                img = document.createElement('img');
                img.src = url;
                img.style.width = '400px';
                img.style.height = 'auto';
                document.getElementById("search-results").appendChild(img);
            }
        })
}

function uploadPhoto() {
    var apiKey = '0wag7ZTxq88QlvoBQpayO1qqAcuGR5fD1VMCEhKP'
    var client = apigClientFactory.newClient({
        apikey: apiKey
    });

    var files = document.getElementById("photoupload").files;
    if (!files.length) {
      return alert("Please choose a file to upload first.");
    }
    var file = files[0];
    var params = {
        "object": "test123.txt",
        "folder": "photosryan",
    };
    var additionalParams = {
        headers : {
            'Content-Type': file.type,
            "x-amz-meta-customLabels" : []
        }
    };

    var body = {
        "file": "12345"
    }

    client.uploadlambdaPost(params, body, additionalParams).then(
        function(response) {
            alert("Succesfully uploaded photo.");
        },
        function(err) {
            alert("err:" + err);
        }
    );
    // let config = {
    //     headers:
    //     {
    //         'Content-Type': file.type,
    //         "X-Api-Key":"0wag7ZTxq88QlvoBQpayO1qqAcuGR5fD1VMCEhKP",
    //         'Access-Control-Allow-Origin': "*"
    //     }
    // };
    // url = 'https://r7hii0cahh.execute-api.us-east-1.amazonaws.com/test-stage/upload/photosryan/' + file.name
    // axios.put(url,file,config).then(response=>{
    //     // console.log(response.data)
    //     alert("Upload successful!!");
    // })
}



// recorder
// reference: https://blog.addpipe.com/using-recorder-js-to-capture-wav-audio-in-your-html5-web-site/
document.addEventListener("DOMContentLoaded", function(event) {

    //webkitURL is deprecated but nevertheless
    URL = window.URL || window.webkitURL;

    var gumStream; 						//stream from getUserMedia()
    var rec; 							//Recorder.js object
    var input; 							//MediaStreamAudioSourceNode we'll be recording

    // shim for AudioContext when it's not avb. 
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext //audio context to help us record

    var recordButton = document.getElementById("recordButton");
    var stopButton = document.getElementById("stopButton");
    var pauseButton = document.getElementById("pauseButton");

    //add events to those 2 buttons
    recordButton.addEventListener("click", startRecording);
    stopButton.addEventListener("click", stopRecording);
    pauseButton.addEventListener("click", pauseRecording);

    function startRecording() {
        console.log("recordButton clicked");

        /*
            Simple constraints object, for more advanced audio features see
            https://addpipe.com/blog/audio-constraints-getusermedia/
        */
        
        var constraints = { audio: true, video:false }

        /*
            Disable the record button until we get a success or fail from getUserMedia() 
        */

        recordButton.disabled = true;
        stopButton.disabled = false;
        pauseButton.disabled = false

        /*
            We're using the standard promise based getUserMedia() 
            https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        */

        navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
            console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

            /*
                create an audio context after getUserMedia is called
                sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
                the sampleRate defaults to the one set in your OS for your playback device

            */
            audioContext = new AudioContext();

            //update the format 
            document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

            /*  assign to gumStream for later use  */
            gumStream = stream;
            
            /* use the stream */
            input = audioContext.createMediaStreamSource(stream);

            /* 
                Create the Recorder object and configure to record mono sound (1 channel)
                Recording 2 channels  will double the file size
            */
            rec = new Recorder(input,{numChannels:1})

            //start the recording process
            rec.record()

            console.log("Recording started");

        }).catch(function(err) {
            //enable the record button if getUserMedia() fails
            console.log(err)
            recordButton.disabled = false;
            stopButton.disabled = true;
            pauseButton.disabled = true
        });
    }

    function pauseRecording(){
        console.log("pauseButton clicked rec.recording=",rec.recording );
        if (rec.recording){
            //pause
            rec.stop();
            pauseButton.innerHTML="Resume";
        }else{
            //resume
            rec.record()
            pauseButton.innerHTML="Pause";

        }
    }

    function stopRecording() {
        console.log("stopButton clicked");

        //disable the stop button, enable the record too allow for new recordings
        stopButton.disabled = true;
        recordButton.disabled = false;
        pauseButton.disabled = true;
        transcribeButton.disabled = false;

        //reset button just in case the recording is stopped while paused
        pauseButton.innerHTML="Pause";
        
        //tell the recorder to stop the recording
        rec.stop();

        //stop microphone access
        gumStream.getAudioTracks()[0].stop();

        //create the wav blob and pass it on to createDownloadLink
        rec.exportWAV(createDownloadLink);
    }

    function createDownloadLink(blob) {
        
        var url = URL.createObjectURL(blob);
        var au = document.createElement('audio');
        var li = document.createElement('li');
        var link = document.createElement('a');

        //name of .wav file to use during upload and download (without extendion)
        var filename = new Date().toISOString();

        //add controls to the <audio> element
        au.controls = true;
        au.src = url;

        //save to disk link
        link.href = url;
        link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
        link.innerHTML = "Save to disk";

        //add the new audio element to li
        li.appendChild(au);
        
        //add the filename to the li
        li.appendChild(document.createTextNode(filename+".wav "))

        //add the save to disk link to li
        li.appendChild(link);
        //add the li element to the ol
        recordingsList.appendChild(li);
    }
})