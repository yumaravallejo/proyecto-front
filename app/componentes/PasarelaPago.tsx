// pages/pago.tsx
import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RJXaXFmAubiNjpUes8i6QDGeAHAkJ69BIFnH43tOEFsooZIbqfmAUiNgNsQgHouMNwQVgnMQ4CRzc9MQQkyj3iy0074J3SrXg');

type cliente = {
    nombre: string | null;
    email: string | null;
    dni: string | null;
    codigoPostal: string | null;
    tarifa: number | null;
    detallesUsuario: string;
    fechaNacimiento: string | null;
    imagen: any;
    password: string | null;
};

function FormularioPago({ cliente, registrar }: { cliente: cliente; registrar: (c: any) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [clientes, setCliente] = useState([cliente])

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
          amount: Math.round((cliente.tarifa ?? 0) * 100),
        }),
      });

      if (!res.ok) throw new Error('Error del servidor');
      registrar(cliente);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='h-full flex flex-col gap-y-15 w-100 p-20'>
      <CardElement />
      <div className='flex flex-row gap-5 justify-center w-full text-center'>
      <button type="submit" className='cursor-pointer rounded-full w-30 text-white h-8 bg-[var(--azul)]' disabled={!stripe || isLoading}>
        {isLoading ? 'Procesando...' : 'Pagar'}
      </button>
      <button type="submit" className='cursor-pointer border-3 rounded-full w-30 h-8 border-[var(--gris-oscuro)]' disabled={!stripe || isLoading}>
        {isLoading ? 'Procesando...' : 'Saltar'}
      </button>
      </div>

    </form>
  );
}

export default function PaginaDePago({ cliente, registrar }: { cliente: cliente; registrar: (c: any) => void }) {

  return (
    <Elements stripe={stripePromise}>
      <FormularioPago cliente={cliente} registrar={registrar} />
      <small className='sm:w-[50%] w-20 text-xs text-justify'>Si saltas este paso quedarás registrado como pendiente de pago. No podrás acceder a las instalaciones hasta realizar el primer cobro.</small>
    </Elements>
  );
}
