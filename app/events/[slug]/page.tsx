type Props = { params: { slug: string } };

export default async function Page({ params }: Props) {
  return <p>slug: {params.slug}</p>;
}
