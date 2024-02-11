import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SimplePeer from 'simple-peer';
import { socket } from '../socket';

const Room = () => {
  const { roomId } = useParams();
  const [myPeer, setMyPeer] = useState(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState([]);
  const [isVideoVisible, setIsVideoVisible] = useState(true);

  const toggleVideoVisibility = async () => {
    if (isVideoVisible) {
      if (stream) {
        console.log('streammmmmm!');

        const tracks = stream.getTracks();

        tracks.forEach((track) => track.stop());
        setStream(null);

        // Set stream to null, triggering a re-render
        setStream(null);

        // Log after setting to null
        console.log('After stopping tracks:', stream);

        // Set visibility to false
        setIsVideoVisible(false);
      }
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(newStream);

        setIsVideoVisible(true);
      } catch (err: unknown) {
        console.error('Error accessing webcam:', err.message);
      }
    }
  };

  useEffect(() => {
    console.log('Stream state updated:', stream);
  }, [stream]);

  useEffect(() => {
    const initializeMediaStream = async () => {
      try {
        console.log('accessed!');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setStream(stream);

        const myPeer = new SimplePeer({
          initiator: true,
          trickle: false,
          stream,
        });
        setMyPeer(myPeer);

        socket.emit('create:room');

        myPeer.on('signal', (data) => {
          socket.emit('join:room', roomId, data);
        });

        socket.on('room:created', (roomId) => {
          // setRoomId(roomId);
          // history.push(`/room/${roomId}`);
        });

        socket.on('user:connected', (userId) => {
          const peer = new SimplePeer({
            initiator: false,
            trickle: false,
            stream,
          });
          setPeers([...peers, { peer, userId }]);
          peer.on('signal', (data) => {
            socket.emit('join:room', roomId, data);
          });
          myPeer.signal(userId);
        });

        socket.on('user:disconnected', (userId) => {
          const disconnectedPeer = peers.find((peer) => peer.userId === userId);
          if (disconnectedPeer) {
            disconnectedPeer.peer.destroy();
            setPeers((prevPeers) =>
              prevPeers.filter((peer) => peer.userId !== userId)
            );
          }
        });
      } catch (error) {
        console.error('Error accessing webcam:', error.message);
      }
    };

    if (!stream) {
      initializeMediaStream();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (myPeer) {
        myPeer.destroy();
      }
    };
  }, [myPeer, peers, roomId]);

  return (
    <div className='container w-[90%] max-w-[1200px] mx-auto'>
      <div className='flex justify-between items-center'>
        <h1 className='my-4 text-2xl font-semibold'>MeetUp</h1>
        <p>
          <strong>Room ID:</strong> {roomId}
        </p>
      </div>

      <div>
        {peers.map((peer) => (
          <video
            key={peer.userId}
            autoPlay
            playsInline
            ref={(ref) => (ref ? (ref.srcObject = peer.peer.stream) : null)}
          />
        ))}
      </div>
      {stream && isVideoVisible ? (
        <video
          id='local-video'
          autoPlay
          playsInline
          muted
          className='my-4 w-[480px] object-cover aspect-video rounded-md'
          ref={(ref) => (ref ? (ref.srcObject = stream) : null)}
        />
      ) : (
        <div className='my-4 w-[480px] aspect-video rounded-md bg-gray-900'></div>
      )}
      <button
        className='bg-zinc-900 text-white p-2 px-4 rounded-md'
        onClick={toggleVideoVisibility}
      >
        Toggle video
      </button>
    </div>
  );
};

export default Room;
