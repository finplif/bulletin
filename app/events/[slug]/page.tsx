export default function Page({ params }: { params: { slug: string } }) {
  return <p>slug: {params.slug}</p>;
}
