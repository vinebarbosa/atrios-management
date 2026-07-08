import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade — Átrios Management",
  description: "Política de Privacidade da plataforma Átrios Management.",
};

const ATUALIZADO_EM = "8 de julho de 2026";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="text-base font-semibold text-fg-1">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-fg-5">
        {children}
      </div>
    </section>
  );
}

export default function PrivacidadePage() {
  return (
    <article>
      <h1 className="text-2xl font-semibold tracking-tight text-fg-hi">
        Política de Privacidade
      </h1>
      <p className="mt-2 text-[13px] text-fg-7">
        Última atualização: {ATUALIZADO_EM}
      </p>

      <p className="mt-6 text-sm leading-relaxed text-fg-5">
        Esta Política de Privacidade descreve como a Átrios (&ldquo;nós&rdquo;)
        coleta, utiliza e protege os dados pessoais tratados na plataforma
        Átrios Management (&ldquo;Plataforma&rdquo;), em conformidade com a Lei
        Geral de Proteção de Dados Pessoais — Lei nº 13.709/2018
        (&ldquo;LGPD&rdquo;).
      </p>

      <Section title="1. Dados que coletamos">
        <p>Tratamos os seguintes dados no contexto da Plataforma:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <span className="text-fg-3">Dados de conta:</span> nome, endereço de
            e-mail e senha (armazenada de forma criptografada e irreversível);
          </li>
          <li>
            <span className="text-fg-3">Dados de convite:</span> e-mail do
            convidado, remetente e status do convite;
          </li>
          <li>
            <span className="text-fg-3">Dados de uso:</span> registros de acesso
            (sessões, data e hora), necessários à segurança e ao funcionamento
            da Plataforma;
          </li>
          <li>
            <span className="text-fg-3">Conteúdo inserido:</span> informações de
            produtos, tarefas, times e credenciais armazenadas no cofre de
            senhas (estas últimas, criptografadas).
          </li>
        </ul>
      </Section>

      <Section title="2. Finalidades do tratamento">
        <p>Utilizamos os dados exclusivamente para:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>autenticar usuários e manter sessões seguras;</li>
          <li>
            enviar convites de acesso e e-mails transacionais (como redefinição
            de senha);
          </li>
          <li>
            viabilizar as funcionalidades de gestão de produtos, times e
            credenciais;
          </li>
          <li>garantir a segurança da Plataforma e prevenir usos indevidos;</li>
          <li>cumprir obrigações legais e regulatórias, quando aplicável.</li>
        </ul>
        <p>Não vendemos dados pessoais nem os utilizamos para publicidade.</p>
      </Section>

      <Section title="3. Cookies e sessões">
        <p>
          Utilizamos apenas cookies estritamente necessários, destinados à
          autenticação e à manutenção da sua sessão. Não utilizamos cookies de
          rastreamento ou de terceiros para fins de marketing.
        </p>
      </Section>

      <Section title="4. Compartilhamento de dados">
        <p>
          Os dados podem ser compartilhados com provedores de infraestrutura
          estritamente necessários à operação da Plataforma (como hospedagem,
          banco de dados e serviço de envio de e-mails), sempre limitados ao
          mínimo necessário. Esses provedores podem estar localizados fora do
          Brasil; nesses casos, a transferência ocorre conforme os mecanismos
          previstos na LGPD.
        </p>
        <p>
          Também poderemos compartilhar dados quando exigido por lei ou por
          ordem de autoridade competente.
        </p>
      </Section>

      <Section title="5. Segurança">
        <p>
          Adotamos medidas técnicas e organizacionais adequadas para proteger os
          dados, incluindo criptografia de senhas de acesso, criptografia das
          credenciais armazenadas no cofre de senhas, comunicação via HTTPS e
          controle de acesso baseado em convites e permissões.
        </p>
        <p>
          Nenhum sistema é totalmente imune a incidentes. Caso ocorra um
          incidente de segurança com risco relevante, comunicaremos os titulares
          afetados e a Autoridade Nacional de Proteção de Dados (ANPD), conforme
          a LGPD.
        </p>
      </Section>

      <Section title="6. Retenção e exclusão">
        <p>
          Mantemos os dados pelo tempo necessário ao cumprimento das finalidades
          descritas nesta Política. Quando uma conta é encerrada, os dados
          pessoais associados são excluídos ou anonimizados, salvo quando a
          retenção for exigida por obrigação legal.
        </p>
      </Section>

      <Section title="7. Seus direitos (LGPD)">
        <p>Nos termos da LGPD, você pode solicitar a qualquer momento:</p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            confirmação da existência de tratamento e acesso aos seus dados;
          </li>
          <li>correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
          <li>portabilidade dos dados, quando aplicável;</li>
          <li>informações sobre o compartilhamento dos seus dados;</li>
          <li>revogação do consentimento, quando esta for a base legal.</li>
        </ul>
        <p>
          Para exercer seus direitos, entre em contato pelo e-mail indicado
          abaixo. Responderemos nos prazos previstos na legislação.
        </p>
      </Section>

      <Section title="8. Alterações desta Política">
        <p>
          Esta Política pode ser atualizada periodicamente. A versão vigente
          estará sempre disponível nesta página, com a data da última
          atualização indicada no topo.
        </p>
      </Section>

      <Section title="9. Contato">
        <p>
          Dúvidas sobre esta Política ou sobre o tratamento de dados pessoais
          podem ser encaminhadas para{" "}
          <a
            href="mailto:contato@atrios.com.br"
            className="text-primary-fg underline-offset-4 transition-colors hover:text-primary-fg-hi hover:underline"
          >
            contato@atrios.com.br
          </a>
          . Consulte também os nossos{" "}
          <Link
            href="/termos"
            className="text-primary-fg underline-offset-4 transition-colors hover:text-primary-fg-hi hover:underline"
          >
            Termos de Serviço
          </Link>
          .
        </p>
      </Section>
    </article>
  );
}
