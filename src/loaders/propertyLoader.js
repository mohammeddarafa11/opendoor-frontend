import { unitsAPI } from "../services/api";

export const propertyLoader = async ({ params }) => {
  try {
    const unit = await unitsAPI.getUnitById(params.id);
    if (!unit) {
      throw new Response("Property not found", { status: 404 });
    }
    return unit;
  } catch (error) {
    console.error("Error loading property:", error);
    throw new Response("Property not found", { status: 404 });
  }
};
