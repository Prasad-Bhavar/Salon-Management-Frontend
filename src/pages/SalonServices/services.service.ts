import api from "~/api/apiInstance";

export async function getOwnerServices() {

    const res =
        await api.get(
            "/salon-services"
        );

    return res.data;
}

export async function getOwnerServiceById(
    id: string
) {

    const res =
        await api.get(
            `/salon-services/${id}`
        );

    return res.data;
}

export async function createOwnerService(
    payload: any
) {

    const res =
        await api.post(
            "/salon-services",
            payload
        );

    return res.data;
}

export async function updateOwnerService(
    id: string,
    payload: any
) {

    const res =
        await api.put(
            `/salon-services/${id}`,
            payload
        );

    return res.data;
}

export async function getServiceCategories() {

    const res =
        await api.get(
            "/salon-services/categories"
        );

    return res.data;
}

export async function getMasterServices(
    categoryId: number
) {

    const res =
        await api.get(
            "/salon-services/master-services",
            {
                params: {
                    category_id:
                        categoryId,
                },
            }
        );

    return res.data;
}