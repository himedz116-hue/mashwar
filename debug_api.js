// Quick debug script to check API responses for images
const API_BASE = "https://meshwarsv2.meshwars.net";

async function main() {
  // Read token from a file or env
  const tokenArg = process.argv[2];
  if (!tokenArg) {
    console.log("Usage: node debug_api.js <admin_token>");
    console.log("Get token from browser localStorage key: meshwar_admin_token");
    process.exit(1);
  }

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${tokenArg}`
  };

  // 1. Check drivers list
  console.log("\n=== DRIVERS (first 2) ===");
  try {
    const driversRes = await fetch(`${API_BASE}/api/admin/drivers`, { headers });
    const driversData = await driversRes.json();
    const drivers = driversData.data || [];
    drivers.slice(0, 2).forEach(d => {
      console.log(JSON.stringify({
        name: d.name,
        avatar: d.avatar,
        national_id: d.national_id,
        driving_license: d.driving_license,
        car_license: d.car_license,
        face_image: d.face_image,
        car: d.car,
        city: d.city,
        status: d.status,
        ALL_KEYS: Object.keys(d)
      }, null, 2));
    });
  } catch (e) { console.log("Error:", e.message); }

  // 2. Check users list
  console.log("\n=== USERS (first 2) ===");
  try {
    const usersRes = await fetch(`${API_BASE}/api/admin/users`, { headers });
    const usersData = await usersRes.json();
    const users = usersData.data || [];
    users.slice(0, 2).forEach(u => {
      console.log(JSON.stringify({
        name: u.name,
        avatar: u.avatar,
        ALL_KEYS: Object.keys(u)
      }, null, 2));
    });
  } catch (e) { console.log("Error:", e.message); }

  // 3. Check car types
  console.log("\n=== CAR TYPES (first 2) ===");
  try {
    const carsRes = await fetch(`${API_BASE}/api/admin/car_types`, { headers });
    const carsData = await carsRes.json();
    const cars = carsData.data || [];
    cars.slice(0, 2).forEach(c => {
      console.log(JSON.stringify({
        name: c.name,
        icon: c.icon,
        ALL_KEYS: Object.keys(c)
      }, null, 2));
    });
  } catch (e) { console.log("Error:", e.message); }

  // 4. Check cars
  console.log("\n=== CARS (first 2) ===");
  try {
    const carsRes = await fetch(`${API_BASE}/api/admin/cars`, { headers });
    const carsData = await carsRes.json();
    const cars = carsData.data || [];
    cars.slice(0, 2).forEach(c => {
      console.log(JSON.stringify(c, null, 2));
    });
  } catch (e) { console.log("Error:", e.message); }

  // 5. Check a single driver detail
  console.log("\n=== DRIVER DETAIL (first one) ===");
  try {
    const driversRes = await fetch(`${API_BASE}/api/admin/drivers`, { headers });
    const driversData = await driversRes.json();
    const firstDriver = (driversData.data || [])[0];
    if (firstDriver) {
      const detailRes = await fetch(`${API_BASE}/api/admin/drivers/show?uuid=${firstDriver.uuid}`, { headers });
      const detailData = await detailRes.json();
      console.log(JSON.stringify(detailData.data, null, 2));
    }
  } catch (e) { console.log("Error:", e.message); }

  // 6. Check message users
  console.log("\n=== MESSAGE USERS - DRIVERS (first 2) ===");
  try {
    const msgRes = await fetch(`${API_BASE}/api/admin/messages/users?type=driver`, { headers });
    const msgData = await msgRes.json();
    const users = msgData.data || [];
    users.slice(0, 2).forEach(u => {
      console.log(JSON.stringify(u, null, 2));
    });
  } catch (e) { console.log("Error:", e.message); }
}

main();
