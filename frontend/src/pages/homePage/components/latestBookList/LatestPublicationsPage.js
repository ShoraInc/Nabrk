import React from "react";
import BooksSection from "../BooksSection/BooksSection";
import { useTranslations } from "../../../../hooks/useTranslations";

const LatestPublicationsPage = () => {
  const { t } = useTranslations();
  
  const allPublications = [
    {
      id: 1,
      title: "Ойыл. История в архивных документах",
      author: "Автор",
      image: "https://glstatic.rg.ru/uploads/images/2016/04/19/61c012a02e0e5d8.jpg",
    },
    {
      id: 2,
      title: "Против вульгаризации и упрощенчества в толковании теории марксизма-ленинизма и истории партии",
      author: "Автор",
      image: "https://s.f.kz/prod/2153/2152482_1000.jpg",
    },
    {
      id: 3,
      title: "Дайдидау",
      author: "Автор",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEEb50e2ou9ZET9JjXzDRoC229dX6NR8TG_w&s",
    },
    {
      id: 4,
      title: "Maple интегралды ортасы",
      author: "Автор",
      image: "https://ficwriter.info/images/Pictures_for_Articles/Main/tn.jpg",
    },
    {
      id: 5,
      title: "Сборник методических материалов по музейно-образовательной деятельности",
      author: "Автор",
      image: "https://imo10.labirint.ru/books/925681/cover.jpg/236-0",
    },
    {
      id: 6,
      title: "Қазақ айнасы",
      author: "Автор",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRXQJHImyabBfXt0kuWDDLO2b1_XdUEiptcg&s",
    },
    {
      id: 7,
      title: "Қазақстан тарихы",
      author: "Автор",
      image: "https://simg.marwin.kz/media/catalog/product/cache/8d1771fdd19ec2393e47701ba45e606d/8/d/enciklopediya_azastan_tarihy.jpg",
    },
    {
      id: 8,
      title: "Абай жолы",
      author: "Мұхтар Әуезов",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnMBxuqbYYfg_XYJ3eLBl1oH54zQSKwQtySg&s",
    },
    {
      id: 9,
      title: "Қан мен тер",
      author: "Әбдіжәміл Нұрпейісов",
      image: "https://resources.cdn-kaspi.kz/img/m/p/h12/hfc/63814377177118.jpg?format=gallery-medium",
    },
    {
      id: 10,
      title: "Көшпенділер",
      author: "Ілияс Есенберлин",
      image: "https://cdn.kitap.kz/storage/book/31bcb582e9e4c655579c2fa549ead2d3.jpg",
    },
  ];

  return (
    <BooksSection
      title={t('books.title')}
      books={allPublications}
      showReadCount={false}
      className="latest-publications"
      sectionType="latest"
    />
  );
};

export default LatestPublicationsPage;