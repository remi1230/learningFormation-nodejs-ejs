const { getAllSchedules } = require('../services/backoffice');

const expectedSchedules = [
    {
        "closeTime": "17:00:00", 
        "createdAt": new Date("2024-04-13T12:19:22.000Z"), 
        "dayOfWeek": "Lundi", 
        "id": 1, 
        "openTime": "08:00:00", 
        "order": 1, 
        "updatedAt": new Date("2024-04-13T12:19:22.000Z")
    },
    {
        "closeTime": "17:00:00", 
        "createdAt": new Date("2024-04-13T12:19:44.000Z"), 
        "dayOfWeek": "Mardi", 
        "id": 2, 
        "openTime": "08:00:00", 
        "order": 2, 
        "updatedAt": new Date("2024-04-13T12:19:44.000Z")
    },
    {
        "closeTime": "17:30:00", 
        "createdAt": new Date("2024-04-13T12:19:53.000Z"), 
        "dayOfWeek": 
        "Mercredi", 
        "id": 3, 
        "openTime": "08:00:00", 
        "order": 3, 
        "updatedAt": new Date("2024-04-13T12:19:53.000Z")
    }, 
    {
        "closeTime": "17:30:00", 
        "createdAt": new Date("2024-04-13T12:20:00.000Z"), 
        "dayOfWeek": "Jeudi", 
        "id": 4, 
        "openTime": "09:00:00", 
        "order": 4, 
        "updatedAt": new Date("2024-04-13T12:20:00.000Z")
    },
    {
        "closeTime": "16:30:00", 
        "createdAt": new Date("2024-04-13T12:20:08.000Z"), 
        "dayOfWeek": "Vendredi", 
        "id": 5, 
        "openTime": "07:00:00", 
        "order": 5, 
        "updatedAt": new Date("2024-04-13T12:20:08.000Z")
    }
];
  



describe('getAllSchedules', () => {
    it('should return an array of schedules objects', async () => {
  
      const schedules = await getAllSchedules();

      schedules.forEach((schedule, index) => {
        expect(schedule.id).toEqual(expectedSchedules[index].id);
        expect(schedule.dayOfWeek).toEqual(expectedSchedules[index].dayOfWeek);
        expect(schedule.openTime).toEqual(expectedSchedules[index].openTime);
        expect(schedule.closeTime).toEqual(expectedSchedules[index].closeTime);
        expect(schedule.order).toEqual(expectedSchedules[index].order);
        expect(schedule.createdAt).toEqual(expectedSchedules[index].createdAt);
        expect(schedule.updatedAt).toEqual(expectedSchedules[index].updatedAt);
      });


      /*expect(schedules).toEqual(expect.arrayContaining(expectedSchedules));
      expect(schedules.length).toBe(expectedSchedules.length);*/
    });
  });