import { ContactForm } from '@/components/ui'

export default function Contact() {
  const handleFormSubmit = async (data: any) => {
    // Add form submission logic here
    console.log('Form submitted:', data);
    // You can add API call here to send email or save to database
    alert('Съобщението беше изпратено успешно!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Контакти</h1>
        <p className="mt-2 text-muted-foreground">
          Свържете се с мен за резервации, сътрудничества или запитвания
        </p>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Имейл</h3>
            <p className="text-muted-foreground">contact@model.com</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Телефон</h3>
            <p className="text-muted-foreground">+359 888 123 456</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Агенция</h3>
            <p className="text-muted-foreground">Model Agency Bulgaria</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Локация</h3>
            <p className="text-muted-foreground">София, България</p>
          </div>
        </div>

        {/* Contact Form */}
        <ContactForm onSubmit={handleFormSubmit} />
      </div>

      {/* Additional Info */}
      <div className="bg-muted/50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Информация за резервации</h2>
        <p className="text-muted-foreground">
          За професионални запитвания, моля свържете се директно с моята агенция. 
          За всички други въпроси, използвайте формата за контакт или ме потърсете по имейл.
        </p>
      </div>
    </div>
  );
}