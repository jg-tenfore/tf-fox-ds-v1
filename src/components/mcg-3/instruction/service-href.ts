/** Where the service-first path goes for a private lesson: choose an instructor, or any. */
export const serviceHref = (serviceId: string, courseSlug?: string) =>
    `/instruction/service/${serviceId}/${courseSlug && courseSlug !== "all" ? `?course=${courseSlug}` : ""}`;
