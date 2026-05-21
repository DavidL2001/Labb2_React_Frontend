import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Profile.scss";

const SERVER_URL = "http://localhost:3001";

const Profile = () => {

    
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/profile-image`);
        if (res.data.imageUrl) {

          setImageUrl(res.data.imageUrl);
        }
      } catch {
      }
    };
    fetchProfileImage();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);
    setError(null);
    setSuccess(null);



    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(`${SERVER_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },

      });
      setImageUrl(res.data.imageUrl);
      setSuccess("Profile picture updated!");
    } catch {
      setError("Upload failed. Please try again.");

    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      await axios.delete(`${SERVER_URL}/profile-image`);

      setImageUrl(null);
      setSuccess("Profile picture removed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setError("Could not remove image.");
    }

  };

  return (
    <div className="profile">
      <h1 className="page-title">My Profile</h1>

      <div className="profile__card">
        <div className="profile__avatar">
          {imageUrl ? (
            <img src={imageUrl} alt="Profile" className="profile__image" />


          ) : (
            <div className="profile__placeholder">
              <p>No photo yet</p>
            </div>
          )}
        </div>

        <div className="profile__actions">
          <button
            className="btn-primary"
            onClick={() => fileInputRef.current?.click()}

            disabled={uploading}
          >
            {uploading ? "Uploading...": "Upload Photo"}
          </button>

    {imageUrl && (<button className="btn-secondary" onClick={handleRemoveImage}>
              Remove Photo
            </button>
          )}

<input
        ref={fileInputRef}
        type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {success && <p className="profile__success">{success}</p>}
        {error && <p className="profile__error">{error}</p>}

        <div className="profile__info">
          <h2 className="profile__name">Your Profile</h2>
          <p className="profile__bio">
            Welcome to your David´s FilmVault profile. Upload a photo and start adding movies!
          </p>
        </div>
      </div>
</div>
);
};

export default Profile;
