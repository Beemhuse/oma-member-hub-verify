import { formatDate } from '@/lib/utils/member-utils';
import React, { useState } from 'react';


const IDCard = ({member, card} ) => {
  const [showBack, setShowBack] = useState(false);
// console.log(member, "member")
const admin = {
    signature: null
}
  return (
    <div className=" border w-full " >
      {/* Card Container */}
      <div className="relative w-full">
        {/* Front of the Card */}
        {!showBack && (
          <div id="frontCard" className='h-96 w-full'>
            <img src={"/FrontcardImage.jpg"} alt="Id front" className="w-full" />
            <img
              src={member?.image}
              alt="User picture"
              className="rounded-full absolute top-[70px] w-[26%] h-[175px] object-cover left-[48px]"
            />
            <div className="absolute top-[35%] left-[35%]">
              <h1 className="text-4xl text-green-500 font-bold">{member?.firstName}  {member?.lastName} </h1>
              <h2 className="text-3xl">{member?.country}</h2>
            </div>
            <div className="absolute top-[65%] left-10 w-[60%] px-4 text-black">
              <div className="grid grid-cols-5 gap-x-10">
                <div className="col-span-2 space-y-4">
                <div className=''>
                  <h2 className="font-medium">ID NO:</h2>
                  <p className='text-sm'>{card?.cardId}</p>
                </div>
                 <div className=''>
                  <h2 className="font-medium">Issued:</h2>
                  <p> {formatDate(card?.issueDate)}</p>
                </div>

                </div>
             <div className="col-span-2 space-y-4">

               
                <div className=''>
                  <h2 className="font-medium">Email:</h2>
                  <p>{member?.email}</p>
                </div>
                <div className=' col-span-2'>
                  <h2 className="font-medium">Expires:</h2>
                  <p>{formatDate(card?.expiryDate)}</p>
                </div>
             </div>
              </div>
            </div>
            <img
              src={card?.qrCodeUrl}
              alt="QR Code"
              className="absolute bottom-1 w-32 right-6"
            />
          </div>
        )}

        {/* Back of the Card */}
        {showBack && (
          <div id="backCard">
            <img src="/cardBackImage.jpg" alt="Id back" className="w-full" />
            <div className="absolute top-0 left-0 w-full h-full px-10 space-y-8 py-4">
              <div className="mb-4 flex flex-col items-center text-center">
                <h2 className="text-sm font-medium">
                  THIS CARD IS THE PROPERTY OF ONE MAP AFRICA, IF FOUND <br />
                  PLEASE CONTACT THE NEAREST OFFICE OR POLICE STATION
                </h2>
                <p className="text-sm font-medium mt-2">
                  CETTE CARTE EST LA PROPRIÉTÉ DE ONE MAP AFRICA, <br />
                  SI VOUS LA TROUVEZ, VEUILLEZ CONTACTER LE BUREAU OU <br />
                  LE POSTE DE POLICE LE PLUS PROCHE
                </p>
              </div>

              <div className="flex justify-center gap-10 items-center">
                <div className="text-center flex flex-col items-center p-5 border border-gray-500 w-[50%]">
                  <p className="text-sm font-medium mb-1">SIGNATURE</p>
                  <img src={admin?.signature ?? "/clientSignture.png"} alt="Client signature" className="w-32" />
                </div>
                <img src={card?.qrCodeUrl} className="w-32" alt="QR Code" />
              </div>

              <div className="text-center">
                <h2 className="text-lg font-bold tracking-widest font-mono">
                  &lt;IONEMAPAFRICA09719802&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                  <br />
                  &lt;&lt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                  <br />
                  &lt;&lt;&lt;ONEMAPAFRICA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                </h2>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          className="font-bold border border-blue-600 bg-blue-600 text-white w-32 rounded-sm py-1"
          onClick={() => setShowBack(prev => !prev)}
        >
          {showBack ? 'Show Front' : 'Show Back'}
        </button>
        <button className="font-bold border border-red-800 bg-red-800 text-white w-32 rounded-sm py-1">
          Print Card
        </button>
      </div>
    </div>
  );
};

export default IDCard;
