import { formatDate } from "@/lib/utils/member-utils";
import { useRef, useState } from "react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "@/hooks/use-toast";
const waitForImagesToLoad = (element) => {
  const images = element.querySelectorAll("img");
  const promises = [];

  images.forEach((img) => {
    if (!img.complete || img.naturalHeight === 0) {
      promises.push(
        new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        })
      );
    }
  });

  return Promise.all(promises);
};

const IDCard = ({ member, card, signature }) => {
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const handleSendPDF = async () => {
    if (!card.isActive) {
      toast({
        title: "Card is inactive",
      });
      return;
    }
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 54], // ID card size (CR80 standard)
      });

      const frontElement = frontRef.current;
      const backElement = backRef.current;

      if (!frontElement || !backElement) {
        console.error("Card elements are not available");
        return;
      }

      // Wait for images to load
      await waitForImagesToLoad(frontElement);
      await waitForImagesToLoad(backElement);

      // Capture front
      const frontCanvas = await html2canvas(frontElement, {
        useCORS: true,
        allowTaint: true,
        scale: 3, // High quality
      });
      const frontImgData = frontCanvas.toDataURL("image/png");
      doc.addImage(frontImgData, "PNG", 0, 0, 85.6, 54); // ID card size

      // Capture back
      doc.addPage([85.6, 54], "landscape");
      // backElement.style.display = 'block';
      const backCanvas = await html2canvas(backElement, {
        useCORS: true,
        allowTaint: true,
        scale: 3,
      });
      const backImgData = backCanvas.toDataURL("image/png");
      doc.addImage(backImgData, "PNG", 0, 0, 85.6, 54);
      const pdfData = doc.output("blob"); // Get raw PDF data

      // Create a File object from the PDF data
      const pdfFile = new File(
        [pdfData],
        `${member?.firstName}_${member?.lastName}_IDCard.pdf`,
        { type: "application/pdf" }
      );
      setLoading(true);
      const formData = new FormData();
      formData.append("email", "brightawah94@gmail.com");
      formData.append("name", `${member?.firstName} ${member?.lastName}`);
      formData.append(
        "file",
        pdfData,
        `${member?.firstName}_${member?.lastName}_IDCard.pdf`
      );
      // await fetch("http://localhost:5000/upload-id", {
      await fetch("https://oma-backend-1.onrender.com/upload-id", {
        method: "POST",
        body: formData,
      });
      toast({
        title: "Card sent to user email",
        description: "Message delivered to user",
      });
      setLoading(false);
      // doc.save(`${member?.firstName}_ID_Card.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setLoading(false);
    }
  };
  const handleDownloadPDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 54], // ID card size (CR80 standard)
      });

      const frontElement = frontRef.current;
      const backElement = backRef.current;

      if (!frontElement || !backElement) {
        console.error("Card elements are not available");
        return;
      }

      // Wait for images to load
      await waitForImagesToLoad(frontElement);
      await waitForImagesToLoad(backElement);

      // Capture front
      const frontCanvas = await html2canvas(frontElement, {
        useCORS: true,
        allowTaint: true,
        scale: 3, // High quality
      });
      const frontImgData = frontCanvas.toDataURL("image/png");
      doc.addImage(frontImgData, "PNG", 0, 0, 85.6, 54); // ID card size

      // Capture back
      doc.addPage([85.6, 54], "landscape");
      // backElement.style.display = 'block';
      const backCanvas = await html2canvas(backElement, {
        useCORS: true,
        allowTaint: true,
        scale: 3,
      });
      const backImgData = backCanvas.toDataURL("image/png");
      doc.addImage(backImgData, "PNG", 0, 0, 85.6, 54);

      doc.save(`${member?.firstName}_ID_Card.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="">
      <div className=" border w-full ">
        {/* Card Container */}
        <div className="flex justify-between">
          <button
            disabled={!card.isActive}
            onClick={handleDownloadPDF}
            className="font-bold border bg-yellow-600 text-white p-2 disabled:bg-gray-500 rounded-sm py-1"
          >
            Download Card
          </button>
          <button
            disabled={loading || card.isActive === false}
            onClick={handleSendPDF}
            className="font-bold border border-green-800 bg-green-800 disabled:bg-gray-500 text-white  p-2 rounded-sm py-1"
          >
            {loading ? "Loading" : "Send Card to user"}
          </button>
        </div>
        <div className="relative w-full flex flex-col">
          {/* Front of the Card */}

          <div
            id="frontCard"
            ref={frontRef}
            className={`h-96 w-full relative `}
          >
            <img
              src={"/FrontcardImage.jpg"}
              alt="Id front"
              className="w-full"
              crossOrigin="anonymous"
            />
            <img
              src={member?.image}
              crossOrigin="anonymous"
              alt="User picture"
              className="rounded-full absolute top-[70px] w-[26%] h-[175px] object-cover aspect-square left-[46px]"
            />
            <div className="absolute top-[35%] left-[35%]">
              <h1 className="text-2xl w-80 font-bold text-green-500">
                {member?.firstName} {member?.lastName}{" "}
              </h1>
              <h2 className="text-xl">{member?.country}</h2>
            </div>
            <div className="absolute top-[65%] left-10 w-[60%] px-4 text-black">
              <div className="grid grid-cols-5 gap-x-2">
                <div className="col-span-3 space-y-4">
                  <div className="">
                    <h2 className="font-bold">ID NO:</h2>
                    <p className="text-sm">{card?.cardId}</p>
                  </div>
                  <div className="">
                    <h2 className="font-bold">Issued:</h2>
                    <p className="text-sm"> {formatDate(card?.issueDate)}</p>
                  </div>
                </div>
                <div className="col-span-2 space-y-4">
                  <div className="w-56">
                    <h2 className="font-bold">Role:</h2>
                    <p className="text-sm  text-wrap ">
                        {member?.role
                        ?.split("_")
                        .map(
                          (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </p>
                  </div>
                  <div className=" col-span-2">
                    <h2 className="font-bold">Expires:</h2>
                    <p className="text-sm">{formatDate(card?.expiryDate)}</p>
                  </div>
                </div>
              </div>
            </div>
            <img
              src={card?.qrCodeUrl}
              alt="QR Code"
              crossOrigin="anonymous"
              className="absolute bottom-1 w-32 right-6"
            />
          </div>

          {/* Back of the Card */}
          <div
            id="backCard"
            ref={backRef}
            className={`min-h-[400px] mt-10 relative`}
          >
            <img
              src="/cardBackImage.jpg"
              alt="Id back"
              className="w-full"
              crossOrigin="anonymous"
            />
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
                  {signature ? (
                    <img
                      src={signature}
                      alt="Oma signature"
                      className="w-32 "
                      crossOrigin="anonymous"
                    />
                  ) : null}
                </div>
                <img
                  src={card?.qrCodeUrl}
                  className="w-32"
                  alt="QR Code"
                  crossOrigin="anonymous"
                />
              </div>

              <div className="text-center absolute -bottom-8">
                <h2 className="text-lg font-bold tracking-widest font-mono">
                  &lt;IONEMAPAFRICA09719802&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                  <br />
                  &lt;&lt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                  <br />
                  &lt;&lt;&lt;ONEMAPAFRICA&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
                </h2>
                <br />
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button
          onClick={handleDownloadPDF}
          disabled={!card.isActive}
          className="font-bold bg-yellow-600 text-white p-2 rounded-sm py-1 disabled:bg-gray-500 "
        >
          Download Card
        </button>
        <button
          onClick={handleSendPDF}
          disabled={loading || !card.isActive}
          className="font-bold border border-green-800 bg-green-800 disabled:bg-gray-500 text-white  p-2 rounded-sm py-1"
        >
          {loading ? "Loading" : "Send Card to user"}{" "}
        </button>
      </div>
    </div>
  );
};

export default IDCard;
