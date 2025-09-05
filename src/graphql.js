import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      sku
      warehouse
      stock
      demand
    }
  }
`;

export const UPDATE_DEMAND = gql`
  mutation UpdateDemand($id: ID!, $demand: Int!) {
    updateDemand(id: $id, demand: $demand) {
      id
      demand
    }
  }
`;

export const TRANSFER_STOCK = gql`
  mutation TransferStock($id: ID!, $amount: Int!) {
    transferStock(id: $id, amount: $amount) {
      id
      stock
    }
  }
`;
