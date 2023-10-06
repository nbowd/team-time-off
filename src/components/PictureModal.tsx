import "@/components/PictureModal.css"
import { upload } from "@/firebaseSetup";
import React, { ChangeEvent, useState } from 'react'
import firebase from "firebase/compat/app"; // used for interface types;
import { Employee } from "@/types";
import { FileUploader } from "react-drag-drop-files";

interface PictureModalProps {
  pictureModalRef: React.RefObject<HTMLDialogElement>,
  user: firebase.User | null,
  profile?: Employee | null,
  setProfilePicture: Function
}

const fileTypes = ["JPG", "PNG"]

function PictureModal({ pictureModalRef, user, profile, setProfilePicture }: PictureModalProps) {
  const [photo, setPhoto] = useState<object | null>(null)
  const [loading, setLoading] = useState(false)

  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement, MouseEvent>) => {
    const dialogDimensions = pictureModalRef.current?.getBoundingClientRect();

    if (e.clientX < dialogDimensions!.left ||
        e.clientX > dialogDimensions!.right ||
        e.clientY < dialogDimensions!.top ||
        e.clientY > dialogDimensions!.bottom ) {
      pictureModalRef.current?.close()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoto(e)
  }

  const handleSubmit = () => {
    if (photo === null) return;
    upload(photo, user, setLoading, profile!,setProfilePicture)
  }

  return (
    <dialog ref={pictureModalRef} className="picture-modal" onClick={(e) => onDialogClick(e)}>
      <div className="picture-modal-div">
        <h2>Upload New Profile Picture:</h2>
        
        <div className="picture-modal-input">
          <FileUploader handleChange={handleChange} name="file" className='drag-drop' types={fileTypes} />
        </div>

        <button disabled={loading || !photo} className="picture-modal-upload" onClick={handleSubmit}>Upload</button>
        <button onClick={() => pictureModalRef.current?.close()} className='close-modal'>&times;</button>
      </div>
    </dialog>
  )
}

export default PictureModal