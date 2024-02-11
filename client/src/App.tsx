import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const createRoom = () => {
    navigate(`/room/${roomId}`);
  };

  const joinRoom: React.FormEventHandler<HTMLFormElement> = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    navigate(`/room/${roomId}`);
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-4xl my-2'>MeetUp 🚀</h1>
        <p>Where teams come together to build amazing things.</p>

        <form onSubmit={joinRoom} className='flex gap-4 my-4 mt-12'>
          <input
            type='text'
            placeholder='Enter room id'
            name='room'
            id='room'
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className='p-2 rounded-md border border-zinc-300'
          />

          <button
            type='submit'
            className='bg-zinc-900 text-white p-2 px-4 rounded-md'
          >
            Join Room
          </button>
        </form>

        <div className='flex items-center flex-col'>
          <p>OR</p>
          <button
            onClick={createRoom}
            className='bg-zinc-900 text-white p-2 my-2 px-4 rounded-md'
          >
            Create a room
          </button>{' '}
        </div>
      </div>
    </div>
  );
}

export default App;
