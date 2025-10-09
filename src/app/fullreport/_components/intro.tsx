import React from "react";
import { MapPin } from "lucide-react";
import "./style.css"

const Intro = ({ name, specialty, location, rating }: { 
    name: string;
    specialty: string;
    location: string;
    rating: number;
}) => {

    console.log("location", location);
    
  const [city, state] = location
    .split(',')
    .map(part => part.trim())
    .filter(Boolean); 

  const displayLocation =
    city && state ? `${city}, ${state}` : city || state || '';

    return (
  <div>
    {/* Always show name */}
    <h1>{name}</h1>

    {/* Show specialty + location only on md and larger */}
    <div className="hidden md:flex justify-between items-center">
      <h3 className="font-normal text-slate-600">{specialty}</h3>
      <div className="flex items-center gap-2 text-slate-600">
        <MapPin size={16} />
        <span>{displayLocation}</span>
      </div>
    </div>

    {/* Show only name + location on small screens */}
    <div className="flex md:hidden items-center gap-2 text-slate-600 mt-2">
      <MapPin size={16} />
      <span>{displayLocation}</span>
    </div>
  </div>
);

}
export default Intro

// import React from "react";
// import { MapPin } from "lucide-react";
// import "./style.css"

// const Intro = ({ name, specialty, location, rating }: { 
//     name: string;
//     specialty: string;
//     location: string;
//     rating: number;
// }) => {
//     const getRatingLabel = (rating: number) => {
//         if (rating >= 4.5) return "Excellent";
//         if (rating >= 3.5) return "Good";
//         if (rating >= 2.5) return "Average";
//         return "Poor";
//     };

//     return (
//         <div className="dr_intro">
//             <h1>{name}</h1>
//             <div className="flex justify-between items-center">
//                 <p>{specialty}</p>
//                 <div className="flex items-center gap-4">
//                     <div className="flex items-center gap-2 text-gray-600">
//                         <MapPin size={16} />
//                         <span>{location}</span>
//                     </div>
//                     <div className="bg-slate-900 text-white px-4 py-2 rounded-lg">
//                         {getRatingLabel(rating)} {rating.toFixed(1)}/5
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Intro;