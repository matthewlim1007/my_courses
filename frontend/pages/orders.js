import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';
import DisplayError from '../components/ErrorMessage';
import formatMoney from '../lib/formatMoney';
import OrderItemsStyles from '../components/styles/OrderItemStyles';

const USERS_ORDER_QUERY = gql`
  query {
    allOrders {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

const OrderUl = styled.ul`
  display: gird;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

function countItemsInAnOrder(order) {
  return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

export default function OrdersPage() {
  const { data, error, loading } = useQuery(USERS_ORDER_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { allOrders } = data;
  return (
    <div>
      <Head>
        <title>Your Orders ({allOrders.length})</title>
      </Head>
      <h2>You have {allOrders.length} orders!</h2>
      <OrderUl>
        {allOrders.map((order) => (
          <OrderItemsStyles>
            <Link href={`/order/${order.id}`}>
              <a>
                <div className="order-meta">
                  <p>{countItemsInAnOrder} Items</p>
                  <p>
                    {order.items.length} Product
                    {order.items.length === 1 ? '' : 's'}
                  </p>
                  <p>{formatMoney(order.total)}</p>
                </div>
                <div className="images">
                  {order.items.map((item) => (
                    <img
                      key={`image-${item.id}`}
                      src={item.photo?.image?.publicUrlTransformed}
                      alt={item.name}
                    />
                  ))}
                </div>
              </a>
            </Link>
          </OrderItemsStyles>
        ))}
      </OrderUl>
    </div>
  );
}
