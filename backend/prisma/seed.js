import { prisma } from '../src/config/database.js'
const routes = [
 {origin:'Kigali',destination:'Huye',baseFare:'2500.00',distanceKm:'132.00',durationMins:180},
 {origin:'Kigali',destination:'Musanze',baseFare:'2000.00',distanceKm:'100.00',durationMins:150},
 {origin:'Huye',destination:'Kigali',baseFare:'2500.00',distanceKm:'132.00',durationMins:180},
]
async function main(){
 const vehicle=await prisma.vehicle.upsert({where:{plate:'RUTA-DEMO-01'},update:{model:'Demo coach',capacity:28},create:{plate:'RUTA-DEMO-01',model:'Demo coach',capacity:28}})
 const now=new Date()
 for(const data of routes){
  const route=await prisma.route.upsert({where:{origin_destination:{origin:data.origin,destination:data.destination}},update:{baseFare:data.baseFare,distanceKm:data.distanceKm,durationMins:data.durationMins,active:true},create:{...data,active:true}})
  for(const offset of [1,2,3]){
   const departureAt=new Date(now);departureAt.setUTCDate(departureAt.getUTCDate()+offset);departureAt.setUTCHours(7+offset,0,0,0)
   const exists=await prisma.trip.findFirst({where:{routeId:route.id,vehicleId:vehicle.id,departureAt},select:{id:true}})
   if(!exists){const arrivalAt=new Date(departureAt.getTime()+data.durationMins*60000);await prisma.trip.create({data:{routeId:route.id,vehicleId:vehicle.id,departureAt,arrivalAt,status:'SCHEDULED'}})}
  }
 }
 console.info('Ruta demo routes and future trips are ready.')
}
main().catch(e=>{console.error('Failed to seed Ruta demo data',e);process.exitCode=1}).finally(async()=>{await prisma.$disconnect()})
