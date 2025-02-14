import { getDownloadURL, getStorage, uploadBytesResumable, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
    const{ currentUser } = useSelector(state => state.user)
    const navigate = useNavigate();
    const params = useParams();
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls : [],
        name: '',
        description:'',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false
    })
    const [imageUploadError, setImageUploadError] = useState (false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    //for when we click edit button for a listing, we need to show info once the page loads
    useEffect(() => {
      //cannot call useEffect as an async function
      const fetchListing = async () => {
        const listingId = params.listingId;
        // console.log(listingId);
        
        const res = await fetch(`/api/listing/get/${listingId}`)
        const data = await res.json();
        if(data.success === false) {
          console.log(data.message);
          return;
        }
        setFormData(data);
      }
      fetchListing();
    }, [])


    
    const handleImageSubmit = () => {
        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true);
            setImageUploadError(false);

            //multiple images  will be uploaded. so we need to waiy for multiple asynchronous operations to
            //happen. so multiple promises should be resolved before proceeding.
            //in promises array there will be multiple promises for each file.
             const promises = [];

            for(let i=0; i<files.length; i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls), 
                });
                setImageUploadError(false);
                setUploading(false);
                
            }).catch(() => {
                setImageUploadError('Image upload failed (2 mb max per image')
                setUploading(false);
            }); 
        }else{
            setImageUploadError('You can only upload 6 images per listing')
            setUploading(false);
        }
    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name //adding date and time to make tha file nane unique. 
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is "+ progress +"% completed");
                    
                },
                (err) => {
                    reject(err);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    })
                }
            )
        })
    }
    
    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !==index)
        })
    }

    const handleChange = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
                ...formData, type: e.target.id
            })
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
            setFormData({
                ...formData, [e.target.id]: e.target.checked
            })
        }
        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
            setFormData({
                ...formData, [e.target.id]: e.target.value
            })
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            if(formData.imageUrls.length < 1){
                return setError('You must upload atleast one image')
            }
            if(+formData.regularPrice < +formData.discountPrice){
                return setError('Discount price must be lower than regular price')
            }
            setLoading(true);
            setError(false);
            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef:currentUser._id,
                }),
            })
            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                setError(data.message)
            }
            navigate(`/listing/${data._id}`);

        }catch(err){
            setError(err.message);
            loading(false);
        }
    }

  return (
    <main className="p-3 max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">Update a Listing</h1>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1">
                <input onChange={handleChange} value={formData.name} type="text" placeholder="Name" className="border p-3 rounded-lg" id="name" maxLength='62' minLength='10' required/>
                <textarea type="text" 
                onChange={handleChange} value={formData.description}placeholder="Description" className="border p-3 rounded-lg" id="description" required/>
                <input onChange={handleChange} value={formData.address} type="text" placeholder="Address" className="border p-3 rounded-lg" id="address" required/>
                <div className="flex gap-6 flex-wrap">
                    <div className="flex gap-2">
                        <input  onChange={handleChange} checked={formData.type==='sale'} type="checkbox" className="w-5" id="sale" />
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.type === 'rent'} type="checkbox" className="w-5" id="rent" />
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.parking === true} type="checkbox" className="w-5" id="parking" />
                        <span>Parking spot</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.furnished === true} type="checkbox" className="w-5" id="furnished" />
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-2">
                        <input onChange={handleChange} checked={formData.offer === true} type="checkbox" className="w-5" id="offer" />
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} value={formData.bedrooms} className="p-3 border border-gray-300 rounded-lg" type="number" id="bedrooms" min='1' max='10' required />
                        <p>Beds</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} value={formData.bathrooms}  className="p-3 border border-gray-300 rounded-lg" type="number" id="bathrooms" min='1' max='10' required />
                        <p>Baths</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input onChange={handleChange} value={formData.regularPrice}  className="p-3 border border-gray-300 rounded-lg" type="number" id="regularPrice"  min='50' max='10000000' required />
                        <div className="flex flex-col items-center">
                            <p>Regular Price</p>
                            <span className="text-xs">($ / month)</span>
                        </div>
                    </div>
                    {formData.offer && (
                        <div className="flex items-center gap-2">
                            <input onChange={handleChange} value={formData.discountPrice} className="p-3 border border-gray-300 rounded-lg" type="number" id="discountPrice" min='0' max='10000000' required />
                            <div className="flex flex-col items-center">
                                <p>Discount Price</p>
                                <span className="text-xs">($ / month)</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col flex-1 gap-4">
                <p className="font-semibold">Images:
                    <span className="font-normal text-gray-600 ml-2">The first image will be the cover (max 6)</span>
                </p>
                <div className= "flex gap-4">
                    <input onChange={(e) => setFiles(e.target.files)} className="p-3 border border-gray-300 rounded w-full" type="file" id="images" accept="image/*" multiple />
                    <button disabled={uploading} type="button" onClick={handleImageSubmit} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled::opacity-80">{uploading ? 'Uploading...' : 'Upload'}</button>
                </div>
                <p className="text-red-700 text-sm">{imageUploadError && imageUploadError }</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                        <div key={url} className="flex justify-between p-3 border items-center">
                            <img src={url} alt="listing-image" className="w-20 h-20 object-contain rounded-lg"></img>
                            <button onClick={() => handleRemoveImage(index)} type="button" className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75">Delete</button>
                        </div>
                    ))
                }
                <button disabled={loading || uploading}  className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'Updating...' : 'Update Listing'}</button>
                {error && <p className="text-red-700 text-sm">{error}</p>}
            </div>
            
        </form>
    </main>
  )
}
