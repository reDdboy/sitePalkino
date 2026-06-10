import { Phone } from "lucide-react";

export default function Donate() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="font-serif text-4xl font-bold text-foreground text-center mb-8">
                Помочь храму
            </h1>

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Основной блок */}
                <div className="bg-church-gold/5 rounded-[12px] p-6 md:p-8 border border-church-gold/20">
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Дорогие братья и сестры
                    </h2>

                    <p className="font-serif text-xl text-foreground/80 mb-6">
                        Вместе мы сможем вдохнуть новую жизнь в это святое место.
                    </p>

                    <p className="text-foreground/80 mb-8">
                        Не оставайтесь в стороне, присоединяйтесь к благому делу восстановления храма<br />
                        Ваши молитвы и пожертвования – это семена, которые прорастут добрыми делами и принесут урожай духовности и веры
                    </p>

                    <div className="border-t border-church-gold/30 my-6"></div>

                    <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                        Желающие помочь в ремонте нашего храма могут отправить посильную помощь:
                    </h3>

                    {/* Реквизиты */}
                    <div className="bg-background/50 rounded-lg p-4 md:p-6 space-y-2 text-sm">
                        <p><span className="font-bold">Наименование:</span> МРО ПРАВ. ПРИХОД ЦЕРКВИ ПРЕП. СЕРАФ. САРОВ. С. ПАЛКИНО АНТР. Р. ГАЛИЧ.ЕП. РУССК. ПРАВ. ЦЕРКВИ (МОС. ПАТР)</p>
                        <p><span className="font-bold">Адрес:</span> УЛИЦА СОВЕТСКАЯ, Д. Д. 53, КОСТРОМСКАЯ ОБЛАСТЬ, Р-Н АНТРОПОВСКИЙ, СЕЛО ПАЛКИНО</p>
                        <p><span className="font-bold">Номер счёта:</span> 40703810101140000041</p>
                        <p><span className="font-bold">Валюта:</span> РОССИЙСКИЙ РУБЛЬ</p>
                        <p><span className="font-bold">ИНН:</span> 4408002065</p>
                        <p><span className="font-bold">КПП:</span> 440801001</p>
                        <p><span className="font-bold">Банк:</span> АО «АЛЬФА-БАНК»</p>
                        <p><span className="font-bold">Корреспондентский счёт:</span> 30101810200000000593</p>
                        <p><span className="font-bold">БИК:</span> 044525593</p>
                    </div>

                    <div className="border-t border-church-gold/30 my-6"></div>

                    {/* Контакты и примечание */}
                    <div className="space-y-3">
                        <p className="text-lg">
                            <span className="font-bold">Контактный телефон:</span>{' '}
                            <a href="tel:+79999040403" className="text-church-brown hover:underline">
                                +7 (999) 904-04-03
                            </a>{' '}
                            (Матушка Семченко Наталия)
                        </p>

                        <p className="text-foreground/80">
                            <span className="font-bold">Важно:</span> просим указывать текст: <span className="italic">«На восстановление храма»</span>
                        </p>
                    </div>

                    <div className="mt-8 p-4 bg-church-gold/10 rounded-lg text-center">
                        <p className="font-serif text-xl font-bold text-foreground">
                            ВСЕ ВМЕСТЕ МЫ ОБЯЗАТЕЛЬНО ОСИЛИМ ЭТО ДОБРОЕ ДЕЛО
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
