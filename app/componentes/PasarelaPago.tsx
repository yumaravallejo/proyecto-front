// pages/pago.tsx
import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RJXaXFmAubiNjpUes8i6QDGeAHAkJ69BIFnH43tOEFsooZIbqfmAUiNgNsQgHouMNwQVgnMQ4CRzc9MQQkyj3iy0074J3SrXg');

type Props = {
    tarifa: number | null;
    registro: ()=>void;
};

function FormularioPago(props: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    const cardElement = elements.getElement(CardElement);
    const { token, error } = await stripe.createToken(cardElement!);

    if (error) {
      alert('Error con el pago: ' + error.message);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pagos/realizar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.id,
          tarifa: props.tarifa,
        }),
      });

      if (!res.ok) alert('Error del servidor');
      props.registro();
    } catch (err) {
      alert('Error: ' + err);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div  className='h-full flex flex-col gap-y-15 w-100'>
    <form onSubmit={handleSubmit} className='h-full flex flex-col gap-y-15 w-100 p-20'>
      <CardElement />
      <div className='flex flex-row gap-5 justify-center w-full text-center'>
      <button type="submit" className='cursor-pointer rounded-full w-30 text-white h-8 bg-[var(--azul)]' disabled={!stripe || isLoading}>
        {isLoading ? 'Procesando...' : 'Pagar'}
      </button>
      <button type='button' onClick={props.registro} className='cursor-pointer rounded-full w-30 text-white h-8 bg-[var(--gris-oscuro)]'>
        Saltar
      </button>
      </div>

    </form>
    </div>
  );
}

export default function PaginaDePago(props: Props) {

  return (
    <Elements stripe={stripePromise}>
      <FormularioPago tarifa={props.tarifa} registro={props.registro} />
      <small className='sm:w-[50%] w-20 text-xs text-center'>Si saltas este paso quedarás registrado como pendiente de pago. No podrás acceder a las instalaciones hasta realizar el primer cobro.</small>
    </Elements>
  );
}
