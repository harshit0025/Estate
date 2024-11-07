import Listing from '../Models/ListingModel.js'
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
    try{
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    }catch(err) {
        next(err);
    }
}
 
export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if(!listing){
        return next(errorHandler(404, 'Listing not found!'))
    }

    //Checking if the listing is of the same user or not
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, 'You can only delete you own listing'))
    }

    try{
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json("Listing has been deleted")
    }catch(err){
        next(err);
    }
}