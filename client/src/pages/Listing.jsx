import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/bundle';
import 'swiper/swiper-bundle.css'

export default function Listing() {
    SwiperCore.use({ Navigation })
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                // console.log(data.imageUrls[1]);

                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }
        fetchListing();
    }, [params.listingId])

    return (
        <main>
            {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
            {error && <p className="text-center my-7 text-2xl text-red-500">Something went wrong!</p>}
            {listing && !loading && !error && (
                (
                    <>
                        <Swiper navigation>
                            {listing.imageUrls.map(url => (
                                <SwiperSlide key={url}>
                                    <div
                                        className="h-[550px]"
                                        style={{
                                            background: `url(${url}) center no-repeat`,
                                            backgroundSize: 'cover',
                                            // zIndex: 100,
                                        }}>

                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </>
                )
            )}
        </main>
        // <main>{listing && listing.name}</main>
    )
}
