import React, { useRef, useState, useEffect } from 'react';
import video from "../assets/test_video_tracking.mp4";
import '../components/Home.css';
import Navbar from './Navbar';
const API = "http://localhost:5000//";


// adding dynamic paths
const Home = () => {

    let intervalRefStream_1 = useRef();
    let intervalRefStream_2 = useRef();

    const stream_1 = useRef();
    const stream_2 = useRef();


    let arr_count = [];

    const [firstsignal, setfirstsignal] = useState(10)
    const [secondsignal, setsecondsignal] = useState(0)
    const [thirdsignal, setthirdsignal] = useState(0)
    const [fourthsignal, setfourthsignal] = useState(0)
    const [caltime, setcaltime] = useState(0)
    const [customefileinput, setcustomefileinput] = useState(null)


    useEffect(() => {

        setTimeout(function () {
            stream_1.current.play()
            decrementalSignal1()
        }, 2000);

    }, []);

    useEffect(() => {
        if (customefileinput != null) {
            handleCounting()
        }
    }, [customefileinput])


    const handleCounting = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "source": customefileinput,
                "class": "all",
                "area_threshold_top": 0.4,
                "area_threshold_bottom": 0.9
            })
        };
        console.log("requestOptions", requestOptions);
        fetch(API + 'count_vehicles', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                Object.entries(data).forEach(
                    ([key, value]) => (
                        arr_count.push(value.count)
                    ));
                const total_count = arr_count.slice(0, 6);
                const sum = total_count.reduce((a, b) => a + b, 0);

                setsecondsignal(sum)

            });
    }

    // GET'S THE IMAGE FETCHED DATA THROUGH MODEL
    // const handleCounting = async (event) => {
    //     let file = photoInput.current.files[0];
    //     await getBase64(file, (result) => {
    //         const requestOptions = {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({
    //                 "source": result,
    //                 "class": "all",
    //                 "area_threshold_top": 0.4,
    //                 "area_threshold_bottom": 0.9
    //             })
    //         };
    //         console.log("requestOptions",requestOptions);
    //         fetch(API + 'count_vehicles', requestOptions)
    //             .then(response => response.json())
    //             .then(data => {
    //                 console.log(data)
    //                 Object.entries(data).forEach(
    //                     ([key, value]) => (
    //                         arr_count.push(value.count)
    //                     ));
    //                 const total_count = arr_count.slice(0, 6);
    //                 const sum = total_count.reduce((a, b) => a + b, 0);

    //                 setcaltime(sum)

    //             });
    //     });
    //     event.preventDefault();
    // }

    // CHECK FUNCTION IF THE MODEL IS CONNECTED
    const handleTest = (event) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        };

        fetch(API + 'test', requestOptions)
            .then(response => response.json())
            .then(data => {
                alert("Python is Awake !!!")
            });
        event.preventDefault()
    }

    // CONVERTS INTO BASE64
    const getBase64 = (file, cb) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    //COUNT DECREMENTAL FOR SIGNAL
    const decrementalSignal1 = () => {
        intervalRefStream_1.current = setInterval(decreaseNumSignal1, 1000);
    }
    const decreaseNumSignal1 = () => {
        setfirstsignal((prev) => ((
            prev === 5 ? secondSignalCal() : console.log("value is not 5 for signal 1"),
            prev === 0 ? handlefirstSingal() : prev = prev - 1)));
    }
    const decrementalSignal2 = () => {
        intervalRefStream_2.current = setInterval(decreaseNumSignal2, 1000);
    }
    const decreaseNumSignal2 = () => {
        setsecondsignal((prev) => ((prev === 0 ? handlesecondSingal() : prev = prev - 1)));
    }

    const handlefirstSingal = () => {
        stream_1.current.pause()
        clearInterval(intervalRefStream_1.current)
        setfirstsignal(0)
        stream_2.current.play()
        decrementalSignal2()
    }
    const handlesecondSingal = () => {
        stream_2.current.pause()
        clearInterval(intervalRefStream_2.current)
        setsecondsignal(0)
    }

    const secondSignalCal = () => {
        var canvas2 = document.querySelector(".second_feed canvas");
        canvas2.getContext("2d").drawImage(stream_2.current, 0, 0)
        const b = canvas2.toDataURL("image/png");
        setcustomefileinput(b)
    }


    return (
        <>
            <div className='montiring-feed'>
                <div className='first_feed'>
                    <video id="video" width="500" controls="true" muted="muted" controls="" ref={stream_1}>
                        <source src={video} />
                    </video>
                    <h1>SIGNAL 1</h1>
                    <h1>{firstsignal}</h1>

                    <canvas className='capture-image' width={1000} height={500}>

                    </canvas>
                </div>
                <div className='second_feed'>
                    <video id="video2" width="500" controls="true" muted="muted" controls="" ref={stream_2}>
                        <source src={video} />
                    </video>
                    <h1>SIGNAL 2</h1>
                    <h1>{secondsignal}</h1>

                    <canvas className='capture-image' width={1000} height={500}>

                    </canvas>
                </div>
            </div>
            <div className="container mt-5" style={{ display: 'none' }}>
                <form className="mb-5" id="handleCounting" onSubmit={handleCounting}>
                    <button type="submit" className="btn btn-success">Test</button>
                </form>
            </div>
        </>
    )

}

export default Home;