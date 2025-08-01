export enum ProductStatusType {
    ACTIVE = "ACTIVE",
    OUT_OF_STOCK = "OUT_OF_STOCK",
    DISCONTINUED = "DISCONTINUED",
    DISABLED = "DISABLED",

}

export const ProductStatusTypeDisplay = {
    [ProductStatusType.ACTIVE]: "Active",
    [ProductStatusType.OUT_OF_STOCK]: "Out of Stock",
    [ProductStatusType.DISCONTINUED]: "Discontinued",
    [ProductStatusType.DISABLED]: "Disabled",   
}
